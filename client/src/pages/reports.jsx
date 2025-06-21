import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthAutorization";
import Spinner from "../components/spinner";
import "../css/dragDrop.css";
import Navbar from "../components/NavBar";

const Reports = () => {
  const { user, loading } = useAuth();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    if (loading || !user?.role) return;
    const url = `http://localhost:8000/reports/files?${user.role}=${user.id}`;
    try {
      setIsFetching(true);
      const res = await axios.get(url);
      setFiles(res.data);
      setFilteredFiles(res.data); // Initial view
    } catch (err) {
      toast.error("Failed to fetch files.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchFiles();
    }
  }, [user, loading]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    if (user?.role === "doctor" || user?.role === "pathologist") {
      setFilteredFiles(
        files.filter((file) =>
          file.patientId?.fullName?.toLowerCase().includes(query)
        )
      );
    } else if (user?.role === "patient") {
      setFilteredFiles(
        files.filter((file) => file.name?.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, files, user]);

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
    if (loading || !selectedFile)
      return toast.warn("Please select a file first.");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.name);

    setIsUploading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/reports/upload?userId=${user.id}`,
        formData
      );
      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setSelectedFile(null);
        await fetchFiles();
      } else {
        toast.error("Upload failed. Try again.");
      }
    } catch (error) {
      toast.error("Upload failed. Or not valid report.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !user) return <Spinner />;

  return (
    <div>
      <Navbar />
      <div className="upload-container ">
        {/* Upload box only for patient */}
        {user.role === "patient" && (
          <div
            className={`drop-area ${isDragging ? "dragging" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              border: "2px dashed #00bcd4",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              background: "#f0fcff",
              transition: "0.3s ease-in-out",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              📤 Drop your file here or click to select
            </p>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#00bcd4",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
            {selectedFile && (
              <p style={{ marginTop: "10px", color: "#555" }}>
                Selected: {selectedFile.name}
              </p>
            )}
            {isUploading && <Spinner />}
          </div>
        )}

        {/* Search box */}
        <div style={{ margin: "30px 0", textAlign: "center" }}>
          <input
            type="text"
            placeholder={
              user.role === "doctor" || user.role === "pathologist"
                ? "Search by patient name..."
                : "Search by file name..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px 20px",
              borderRadius: "25px",
              border: "1px solid #ccc",
              width: "80%",
              maxWidth: "500px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Uploaded Files */}
        <div className="uploaded-files">
          <h4>Your Uploaded Files</h4>
          {isFetching ? (
            <Spinner />
          ) : filteredFiles.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "15px",
              }}
            >
              {filteredFiles.map((file, index) => (
                <div
                  className="file-card"
                  key={index}
                  style={{
                    background: "#e0f7fa",
                    borderRadius: "15px",
                    padding: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  <a
                    href={`http://localhost:8000/${file.path.replace(
                      /\\/g,
                      "/"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: "bold",
                      color: "#0277bd",
                      textDecoration: "none",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    📁 {file.name}
                  </a>
                  <p>🕒 {new Date(file.uploadDate).toLocaleString()}</p>

                  {(user.role === "doctor" || user.role === "pathologist") &&
                    file.patientId?.fullName && (
                      <p>👤 Patient: {file.patientId.fullName}</p>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                marginTop: "30px",
                textAlign: "center",
                color: "#999",
                fontSize: "18px",
                fontStyle: "italic",
              }}
            >
              No files found matching your search.
            </div>
          )}
        </div>

        {/* View Reports Button */}
        {user.role === "patient" && (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              className="viewReportBtn"
              onClick={() => navigate("/analysis")}
              style={{
                padding: "10px 25px",
                fontSize: "16px",
                background: "#009688",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              VIEW REPORTS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
