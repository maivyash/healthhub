import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthAutorization";
import Spinner from "../components/spinner"; // 👈 Add this line
import "../css/dragDrop.css";

const Reports = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      setIsFetching(true);
      const res = await axios.get("http://localhost:8000/reports/files");
      setFiles(res.data);
    } catch (err) {
      toast.error("Failed to fetch files.");
    } finally {
      setIsFetching(false);
    }
  };

  const checkLoggedIn = () => {
    if (!user) {
      toast.error("Please Sign In");
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.warn("Please select a file first.");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.name);

    setIsUploading(true); // show spinner

    try {
      const response = await axios.post(
        "http://localhost:8000/reports/upload",
        formData
      );
      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setSelectedFile(null);
        await fetchFiles();
      }
    } catch (error) {
      toast.error("Upload failed. Try again.");
    } finally {
      setIsUploading(false); // hide spinner
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`drop-area ${isDragging ? "dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <p>Drop Your File Here</p>
        <p>or</p>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUpload();
          }}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {selectedFile && (
          <p style={{ marginTop: "10px" }}>Selected: {selectedFile.name}</p>
        )}

        {isUploading && <Spinner />}
      </div>

      <div className="uploaded-files">
        <h4>Your Uploaded Files</h4>
        {isFetching ? (
          <Spinner />
        ) : (
          files.map((file, index) => (
            <div className="file-card" key={index}>
              <a
                href={`http://localhost:8000/${file.path.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📁 {file.name}
              </a>
              <p>UPLOAD DATE: {new Date(file.uploadDate).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <button
        className="viewReportBtn"
        onClick={() => {
          navigate("/analysis");
        }}
      >
        VIEW REPORTS
      </button>
    </div>
  );
};

export default Reports;
