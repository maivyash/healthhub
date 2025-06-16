import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    const res = await axios.get("http://localhost:8000/reports/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    const response = await axios.post(
      "http://localhost:8000/reports/upload",
      formData
    );
    switch (response.status) {
      case 500:
        toast.error("SERVER ERROR");
        break;
      case 400:
        break;
      case 200:
        break;
      case 200:
        break;
      case 200:
        break;
      default:
        break;
    }
    setSelectedFile(null);
    fetchFiles();
  };
  const navigate = useNavigate();
  return (
    <div className="upload-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="drop-area">
        <p>Drop Your File Here</p>
        <p>or</p>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div className="uploaded-files">
        <h4>Your Uploaded Files</h4>
        {files.map((file, index) => (
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
        ))}
      </div>
      <button
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
