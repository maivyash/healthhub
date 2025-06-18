import React, { useState } from "react";
import "../css/CreateRoomModal.css";
import { toast, ToastContainer } from "react-toastify";
const { useAuth } = require("../components/AuthAutorization");
const { useNavigate } = require("react-router-dom");

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [docError, setDocError] = useState(true);
  const [labError, setLabError] = useState(true);
  const [docName, setDocname] = useState("Enter Doctor Id");
  const [labName, setLabname] = useState("Enter Lab Id");
  const [formData, setFormData] = useState({
    roomName: "",
    problem: "",
    mobile: "",
    doctorId: "",
    labId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const renderdoc = async (doctorId) => {
    const response = await fetch(
      `http://localhost:8000/users/getDoctor?id=${doctorId}`,
      { method: "GET" }
    );
    const result = await response.json();

    if (response.status === 200) {
      setDocname(result.doctorname);
      setDocError(false);
      return true;
    } else {
      setDocname("Enter Doctor Id");
      setDocError(true);
      toast.error(result.error || "Invalid doctor ID");
      return false;
    }
  };

  const renderlab = async (labId) => {
    const response = await fetch(
      `http://localhost:8000/users/getPathologist?id=${labId}`,
      { method: "GET" }
    );
    const result = await response.json();

    if (response.status === 200) {
      setLabname(result.pathologyName);
      setLabError(false);
      return true;
    } else {
      setLabname("Enter Lab Id");
      setLabError(true);
      toast.error(result.error || "Invalid lab ID");
      return false;
    }
  };

  const handleCreateRoom = async () => {
    const { roomName, problem, mobile, doctorId, labId } = formData;

    if (!roomName || !problem || !mobile || !doctorId || !labId) {
      toast.error("Enter all fields properly");
      return;
    }

    if (mobile.length < 10) {
      toast.error("Enter a valid mobile number");
      return;
    }

    const validDoc = await renderdoc(doctorId);
    const validLab = await renderlab(labId);

    if (!validDoc || !validLab) {
      toast.error("Doctor or Lab ID is invalid");
      return;
    }

    if (!user) {
      toast.error("Log in first");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/rooms?createdby=${user.id}&doctorId=${doctorId}&pathologyId=${labId}&roomName=${roomName}&mobilenumber=${mobile}&problem=${problem}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        toast.success("Room created");
        onRoomCreated();
        onClose();
      } else {
        toast.error(result.error || "Room creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content scale-in-center">
        <h2>Create Room</h2>
        <div className="form-grid">
          <div className="form-left">
            <>
              <label>Enter Room name</label>
              <input name="roomName" onChange={handleChange} />
            </>
            <>
              <label>Enter Specific Problem</label>
              <input name="problem" onChange={handleChange} />
            </>
            <>
              <label>Enter Mobile Number</label>
              <input name="mobile" onChange={handleChange} />
            </>
            <>
              <button onClick={handleCreateRoom}>Create Room</button>
            </>
          </div>

          <div className="form-right">
            <div className="ccard doctor">
              <h4>Doctor Corner</h4>
              <inpu>Doctor ID</inpu>
              <input
                name="doctorId"
                onChange={handleChange}
                onBlur={(e) => {
                  renderdoc(e.target.value);
                }}
              />
              <p>Name: Dr. {docName}</p>
            </div>

            <div className="ccard lab">
              <h4>Lab Corner</h4>
              <label>Lab ID</label>
              <input
                name="labId"
                onChange={handleChange}
                onBlur={(e) => {
                  renderlab(e.target.value);
                }}
              />
              <p>Name: {labName}</p>
            </div>
          </div>
        </div>

        <span className="close-btn" onClick={onClose}>
          ×
        </span>
      </div>
    </div>
  );
};

export default CreateRoomModal;
