import { IsoOutlined } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Divider,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../services/api";

const SummaryDetailPage = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    try {
      const response = await api.get(`generate-summary/summaries/${id}/`);
      setSummary(response.data.summaries);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching summary:", err);
      setError("Sorry, something went wrong while fetching the summary.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800">
        <CircularProgress
          size={60}
          color="primary"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800">
        <Typography
          variant="h6"
          color="error"
          fontWeight="bold"
        >
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <NavBar />{" "}
      <Container maxWidth="md" className="mt-6">
        <Card className="shadow-2xl p-8 bg-white rounded-xl overflow-hidden transition-all hover:shadow-3xl">
          <Box className="flex flex-col space-y-4">
            <Typography
              variant="h3"
              color="primary"
              fontWeight="bold"
              align="center"
            >
              {summary.summary_title}
            </Typography>

            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
            >
              {new Date(summary.summary_date).toLocaleDateString()}
            </Typography>

            <Divider className="my-6" />

            <Typography
              variant="body1"
              paragraph
              color="textPrimary"
            >
              {summary.summary_text}
            </Typography>

            {summary.pdf_or_word_file && (
              <Box className="flex justify-center mt-6">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<IsoOutlined />}
                  href={summary.pdf_or_word_file}
                  target="_blank"
                  className="hover:shadow-lg transition-all"
                >
                  Download Document
                </Button>
              </Box>
            )}
          </Box>
        </Card>
      </Container>
    </div>
  );
};

export default SummaryDetailPage;
