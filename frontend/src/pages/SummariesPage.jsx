import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SummaryCard from "../components/SummaryCard";
import api from "../services/api";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";

const SummariesPage = () => {
  const [summaries, setSummaries] = useState([]);
  const isNotMobileScreen = useMediaQuery("(min-width: 1000px)");

  const fetchSummaries = async () => {
    try {
      const response = await api.get("generate-summary/summaries/");
      const data = response.data;

      if (Array.isArray(data.summaries)) {
        setSummaries(data.summaries);
      } else {
        console.error(
          "Received data.summaries is not an array",
          data.summaries
        );
      }
      console.log("summaries : ", data.summaries);
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

  useEffect(() => {
    fetchSummaries();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <NavBar />
      <ToastContainer />
      <div className="flex items-center justify-center mt-6">
        <Box
          display="grid"
          gridTemplateColumns={
            isNotMobileScreen ? "repeat(3, 1fr)" : "repeat(1, 1fr)"
          }
          gap={2}
          mt={2}
          width="80%"
        >
          {summaries.length > 0 ? (
            summaries.map((summary) => (
              <SummaryCard
                key={summary.id}
                id={summary.id}
                textTitle={summary.summary_title}
                summary={summary.summary_text.substring(0, 30)}
                source={(summary.text_source != null
                  ? summary.text_source
                  : summary.pdf_or_word_file
                ).substring(0, 20)}
                date={summary.summary_date}
                reloadSummaries={fetchSummaries}
              />
            ))
          ) : (
            <div>No summaries available</div>
          )}
        </Box>
      </div>
    </div>
  );
};
export default SummariesPage;
