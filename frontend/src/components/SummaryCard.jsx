import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SummaryCard = ({ id, textTitle, summary, source }) => {
  const navigate = useNavigate();

  return (
    <Box
      className="flex flex-col items-center justify-start p-6 rounded-lg"
      sx={{
        maxWidth: 400,
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
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          color: "#1F2937",
          textAlign: "center",
          marginBottom: 2,
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
          marginBottom: 2,
        }}
      >
        {summary.length > 60 ? `${summary.substring(0, 60)}...` : summary}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "#9CA3AF",
          fontStyle: "italic",
          marginBottom: 3,
        }}
      >
        Source: {source}
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        gap={2}
        width="100%"
      >
        <Button
          variant="outlined"
          color="primary"
          sx={{
            flex: 1,
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
            flex: 1,
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
            flex: 1,
            borderColor: "#EF4444",
            color: "#EF4444",
            "&:hover": {
              backgroundColor: "#FEE2E2",
            },
          }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default SummaryCard;
