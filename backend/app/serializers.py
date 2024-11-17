from rest_framework import serializers

from rest_framework import serializers
from .models import Summary


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ['id', 'summary_text', 'summary_title',
                  'summary_date', 'pdf_or_word_file', 'text_source']
