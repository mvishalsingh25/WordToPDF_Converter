import React, { useState } from "react";
import { FaFileWord } from "react-icons/fa6";
import axios from "axios";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertMessage, setConvertMessage] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setSelectedFile(file);
      setConvertMessage("");
      setDownloadError("");
    } else {
      setSelectedFile(null);
      setConvertMessage("");
      setDownloadError("Please select a valid Word file (.doc or .docx).");
    }
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setConvertMessage("Please select a file to convert.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf"
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setSelectedFile(null);
      setDownloadError("");
      setConvertMessage("Your file has been successfully converted!");
    } catch (error) {
      console.error(error);
      setConvertMessage("");
      setDownloadError(
        error.response?.status === 400
          ? `Error: ${error.response.data.message}`
          : "An error occurred during the conversion process."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
          Word to PDF Converter
        </h1>
        <p className="text-center text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
          Convert your Word documents to PDF format effortlessly and quickly.
        </p>

        <div className="space-y-4 sm:space-y-6">
          <label
            htmlFor="fileInput"
            className="flex items-center justify-center w-full px-4 py-4 sm:py-4 bg-gray-100 text-gray-700 border-2  border-slate-300 rounded-lg cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition duration-300"
          >
            <FaFileWord className="text-4xl sm:text-4xl text-blue-500 mr-3" />
            <span className="text-sm sm:text-lg text-center">
              {selectedFile ? selectedFile.name : "Select a Word File"}
            </span>
            <input
              type="file"
              id="fileInput"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="w-full py-2 sm:py-3 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer font-semibold rounded-lg transition duration-300"
          >
            Convert to PDF
          </button>

          {convertMessage && (
            <p className="text-center text-green-500 font-medium text-sm sm:text-base">
              {convertMessage}
            </p>
          )}
          {downloadError && (
            <p className="text-center text-red-500 font-medium text-sm sm:text-base">
              {downloadError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
