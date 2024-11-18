import { Button, TextField, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Bounce, toast, ToastContainer } from "react-toastify";
import NavBar from "../components/NavBar";
import api from "../services/api";

const HomePage = () => {
  const [summaryLength, setSummaryLength] = useState(10);
  const [textToSummarize, setTextToSummarize] = useState("");
  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
    acceptedFiles,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    noClick: true,
    noKeyboard: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);

  const handleClose = () => {
    setOpenBackDrop(false);
  };

  const handleOpen = () => {
    setOpenBackDrop(true);
  };

  const files = acceptedFiles.map((file) => (
    <li
      key={file.path}
      className="text-sm text-gray-700"
    >
      {file.path} - {file.size} bytes
    </li>
  ));

  const handleFileSubmit = async () => {
    if (acceptedFiles.length === 0) {
      toast.warn("No file selected.", {
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
      return;
    }

    setIsGenerating(true);
    handleOpen();

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("summary_len", summaryLength);

    try {
      const response = await api.post("generate-summary/document/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File summary response:", response.data);
      toast.success("File summarization completed successfully!", {
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
    } catch (err) {
      toast.error(
        "An error occurred while summarizing the file. Please try again.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
      console.error("Error summarizing file:", err);
    } finally {
      setIsGenerating(false);
      handleClose();
    }
  };

  const handleTextSubmit = async () => {
    if (!textToSummarize.trim()) {
      toast.warn("Text to summarize is empty.", {
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
      return;
    }

    setIsGenerating(true);
    handleOpen();

    try {
      const response = await api.post("generate-summary/text/", {
        text_to_summarize: textToSummarize,
        summary_len: summaryLength,
      });
      console.log("Text summary response:", response.data);
      toast.success("Text summarization completed successfully!", {
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
    } catch (err) {
      toast.error(
        "An error occurred while summarizing the text. Please try again.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
      console.error("Error summarizing text:", err);
    } finally {
      setIsGenerating(false);
      handleClose();
    }
  };

  const handleSummarize = (e) => {
    e.preventDefault();
    if (acceptedFiles.length > 0) {
      handleFileSubmit();
    } else {
      handleTextSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <NavBar />
      <ToastContainer />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackDrop}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="flex flex-col items-center justify-center mt-2 px-4">
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl">
          <div
            {...getRootProps({
              className:
                "border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition duration-300 ease-in-out",
            })}
          >
            <Typography
              variant="h4"
              className="text-gray-800 font-semibold mb-4"
            >
              Upload Your File
            </Typography>
            <input {...getInputProps()} />
            <p className="text-gray-600 mb-4">
              Drag & drop files here, or click the button below to upload.
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={openFileDialog}
              size="large"
              sx={{
                boxShadow: 3,
                borderRadius: "50px",
                "&:hover": {
                  boxShadow: 5,
                  backgroundColor: "#5C6BC0",
                },
              }}
            >
              Select File
            </Button>
          </div>

          {acceptedFiles.length > 0 && (
            <aside className="mt-6">
              <Typography
                variant="h6"
                className="font-medium text-gray-700"
              >
                Uploaded Files:
              </Typography>
              <ul className="mt-2 space-y-1">{files}</ul>
            </aside>
          )}

          <TextField
            placeholder="Write your text to summarize here"
            disabled={acceptedFiles.length > 0}
            multiline
            fullWidth
            rows={4}
            value={textToSummarize}
            onChange={(e) => setTextToSummarize(e.target.value)}
            sx={{
              marginTop: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                backgroundColor: "#F5F5F5",
                boxShadow: 2,
                "&:hover fieldset": {
                  borderColor: "#7C4DFF",
                },
              },
            }}
          />

          <div className="mt-6">
            <Typography className="mt-3 text-gray-700">
              Summary Length
            </Typography>
            <Slider
              defaultValue={10}
              aria-label="Summary Length"
              valueLabelDisplay="auto"
              value={summaryLength}
              onChange={(e, newValue) => setSummaryLength(newValue)}
              sx={{
                color: "#7C4DFF",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#7C4DFF",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            />
          </div>

          <form
            onSubmit={handleSummarize}
            className="mt-6 w-full max-w-lg flex justify-center"
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="mt-4 px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
              size="large"
            >
              Summarize
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
