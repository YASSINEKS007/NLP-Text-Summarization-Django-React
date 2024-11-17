import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import api from "../services/api";

const SummaryCard = ({ id, textTitle, summary, source, date, reloadSummaries }) => {
  const navigate = useNavigate();

  const deleteSummary = async () => {
    try {
      const response = await api.delete(`generate-summary/delete-summary/${id}/`);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      reloadSummaries();
    } catch (err) {
      toast.error(err.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <Box
      className="flex flex-col items-center justify-between p-6 rounded-lg"
      sx={{
        width: 320,
        height: 380, // Ensure all cards are of the same size
        margin: "auto",
        backgroundColor: "#F9FAFB",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <ToastContainer />
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          color: "#1F2937",
          textAlign: "center",
          marginBottom: 1.5,
        }}
      >
        {textTitle}
      </Typography>

      <Typography
        variant="body1"
        color="textSecondary"
        sx={{
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 1.5,
        }}
      >
        {summary.length > 60 ? `${summary.substring(0, 60)}...` : summary}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "#9CA3AF",
          fontStyle: "italic",
          marginBottom: 1.5,
        }}
      >
        Source: {source}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "#9CA3AF",
          fontStyle: "italic",
          marginBottom: 2,
        }}
      >
        Date: {formattedDate}
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        justifyContent="flex-end" // Position buttons at the bottom
      >
        <Button
          variant="outlined"
          color="primary"
          sx={{
            borderColor: "#3B82F6",
            color: "#3B82F6",
            "&:hover": {
              backgroundColor: "#E0F2FE",
            },
          }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#3B82F6",
            "&:hover": {
              backgroundColor: "#2563EB",
            },
          }}
          onClick={() => navigate(`/summaries/${id}`)}
        >
          Expand
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{
            borderColor: "#EF4444",
            color: "#EF4444",
            "&:hover": {
              backgroundColor: "#FEE2E2",
            },
          }}
          onClick={() => deleteSummary()}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default SummaryCard;
