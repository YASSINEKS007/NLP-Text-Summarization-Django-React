import json
import os
import re
import networkx as nx
import pandas as pd
import PyPDF2
from docx import Document
from dotenv import load_dotenv
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize
from openai import OpenAI
from rest_framework import status
from rest_framework.decorators import (api_view, authentication_classes,
                                       parser_classes, permission_classes)
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import  IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.metrics.pairwise import cosine_similarity

from .models import Summary
from .serializers import SummarySerializer

load_dotenv()



model = SentenceTransformer('bert-base-nli-mean-tokens')



def remove_stopwords(sentence, stop_words):
    return " ".join([word for word in sentence.split() if word not in stop_words])

def find_braces_indices(s):
    first_open = s.find('{')  # Find the first occurrence of '{'
    last_close = s.rfind('}')  # Find the last occurrence of '}'

    if first_open == -1 or last_close == -1:
        return None  # Return None if either '{' or '}' is not found

    return first_open, last_close


def get_json_from_markdown(str_json):
    first_open, last_close = find_braces_indices(str_json)
    return json.loads(str_json[first_open:last_close+1])

def clean_summary(text):
    # Replace \x93 and \x94 with "
    cleaned_text = re.sub(r'\\x9[3|4]', '"', text)
    cleaned_text = re.sub(r'\\x92', "'", cleaned_text)  # Replace \x92 with '
    cleaned_text = re.sub(r'[\x93]', '"', cleaned_text)  # Left double quotes
    cleaned_text = re.sub(r'[\x94]', '"', cleaned_text)  # Right double quotes
    cleaned_text = re.sub(r'[\x92]', "'", cleaned_text)  # Right single quote
    # Replace multiple spaces with a single space
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    return cleaned_text.strip()




def generate_summary(text: str):
    
    sentences = sent_tokenize(text)
    clean_sentences = pd.Series(sentences).str.replace(
        "[^a-zA-Z ]", " ", regex=True)

    clean_sentences = [s.lower().strip() for s in clean_sentences]
    stop_words = set(stopwords.words('english'))
    clean_sentences = [remove_stopwords(
        sentence, stop_words) for sentence in clean_sentences]
    sentence_vectors = model.encode(clean_sentences)
    num_sentences = len(sentence_vectors)
    best_num_clusters = 1
    best_score = -1
    for n_clusters in range(2, min(10, num_sentences)):
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        labels = kmeans.fit_predict(sentence_vectors)
        score = silhouette_score(sentence_vectors, labels)
        if score > best_score:
            best_num_clusters = n_clusters
            best_score = score
    kmeans = KMeans(n_clusters=best_num_clusters, random_state=42)
    labels = kmeans.fit_predict(sentence_vectors)
    clustered_sentences = {}
    for idx, label in enumerate(labels):
        if label not in clustered_sentences:
            clustered_sentences[label] = []
        clustered_sentences[label].append((sentences[idx], idx))
    summaries = []
    for cluster, cluster_sentences in clustered_sentences.items():
        cluster_indices = [s[1] for s in cluster_sentences]
        sim_mat = cosine_similarity(sentence_vectors[cluster_indices])
        # Rank sentences using PageRank
        nx_graph = nx.from_numpy_array(sim_mat)
        scores = nx.pagerank(nx_graph)
        ranked_cluster_sentences = sorted(
            ((scores[i], s[0]) for i, s in enumerate(cluster_sentences)), reverse=True
        )
        # Select the top sentences from the cluster
        top_sentences = [ranked_cluster_sentences[i][1]
                         for i in range(min(10, len(ranked_cluster_sentences)))]
        summaries.append(" ".join(top_sentences))

        cleaned_summary = clean_summary("\n\n".join(summaries))
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=os.getenv('NVIDIA_API_KEY')
        )

        # Generate the improved summary using the LLM
        completion = client.chat.completions.create(
            model="nvidia/llama-3.1-nemotron-70b-instruct",
            messages=[{
                "role": "user",
                "content": (
                        f"Please refine the following summary by performing the following steps:\n"
                        f"1. Expand on the key points with more detailed explanations and relevant examples, ensuring a deeper understanding of the topic.\n"
                        f"2. Provide clear context where needed, explaining the significance of the points to improve clarity for a broad audience.\n"
                        f"3. Use engaging and accessible language, avoiding jargon or overly complex terms, so the content is easy to read and understand.\n"
                        f"4. Ensure the final version is concise, ideally within 4 to 5 sentences, while still covering all major points.\n"
                        f"5. Return a JSON object containing the following fields:\n"
                        f"   - \"title\": A brief, descriptive title or heading summarizing the main theme.\n"
                        f"   - \"summary\": The refined and improved text of the summary.\n\n"
                        f"Original summary:\n{cleaned_summary}\n\n"
                        f"Please only return the JSON object, without any additional commentary or explanation."
                )
            }],
            temperature=0.3,
            top_p=1,
            max_tokens=1024,
            stream=False
        )

        # Extract and clean the LLM response
        llm_response = completion.choices[0].message.content.strip()

        first_open, last_close = find_braces_indices(str(llm_response))

        # # Step 1: Clean invalid newlines in the response
        # cleaned_response = clean_json_markdown(str(llm_response))
        # cleaned_response
        my_summary = json.loads(str(llm_response)[first_open: last_close+1])
        return my_summary


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def generate_summary_text(request):
    text_to_summarize = request.data.get("text_to_summarize")
    summary_len = request.data.get('summary_len')
    summary = generate_summary(text_to_summarize)

    user = request.user

    Summary.objects.create(user=user, summary_text=summary["summary"], summary_title=summary['title'],
                           text_source=text_to_summarize)

    return Response({"summary": summary}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
@parser_classes([MultiPartParser, FormParser])
def generate_summary_document(request):
    file = request.FILES.get("file")
    summary_len = request.data.get("summary_len")

    if not file:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        extracted_text = ""

        # Determine file type and extract text
        if file.name.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                extracted_text += page.extract_text()

        elif file.name.endswith(".docx"):
            doc = Document(file)
            for paragraph in doc.paragraphs:
                extracted_text += paragraph.text + "\n"

        else:
            return Response({"error": "Unsupported file type. Only PDF and DOCX are supported."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Generate the summary
        summary = generate_summary(extracted_text)
        print(summary)

        # Save the summary to the database
        user = request.user

        Summary.objects.create(
            user=user, summary_text=summary["summary"], summary_title=summary['title'], pdf_or_word_file=f"File: {file.name}")

        return Response({"summary": summary}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": f"Failed to process the file: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_summaries(request):
    user = request.user
    print(user.id)
    # Use filter to get summaries related to the authenticated user
    summaries = Summary.objects.filter(user=user)
    serializer = SummarySerializer(summaries, many=True)
    return Response({"summaries": serializer.data}, status=status.HTTP_200_OK)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def delete_summary(request, id):
    try:
        summary = Summary.objects.get(id=id)
    except Summary.DoesNotExist:
        return Response({"message": "Summary not found"}, status=status.HTTP_404_NOT_FOUND)

    summary.delete()

    return Response({"message": "Summary deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_summary(request, id):
    try:
        summary = Summary.objects.get(id=id)
    except Summary.DoesNotExist:
        return Response({"message": "Summary not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = SummarySerializer(summary)
    return Response({"summaries": serializer.data}, status=status.HTTP_200_OK)