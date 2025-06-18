import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import CreateRoomModal from "../components/CreateRoomModal";

import { useNavigate } from "react-router-dom";
import "../css/RoomDash.css";
import { useAuth } from "../components/AuthAutorization";
const RoomsDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      // Replace with your real API
      const response = await fetch(
        `http://localhost:8000/rooms?createdby=${user.id}`
      );
      const data = await response.json();
      console.log(data);

      switch (response.status) {
        case 424:
          toast.error(data.error || "Something went wrong");
          return;
        case 224:
          toast.error("224");
          return;
        case 200:
          const mappedRooms = data.map((item, index) => ({
            _id: item._id,
            roomName: item.roomName,
            doctor: item.doctor,
            createdOn: item.createdOn,
          }));
          setRooms(mappedRooms);
          return;
        default:
          toast.error(data.error || "Something went wrong");
          return;
      }
      // Map data to your format
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Failed to fetch rooms:", error);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      toast.error("Please Login!!");
      navigate("/login", { replace: true });
      return;
    }
    fetchRooms();
  }, [loading, user]);

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(`http://localhost:8000/rooms/${roomId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.status === 200) {
        toast.success("Room deleted!");
        fetchRooms(); // Refresh list
      } else {
        toast.error(result.error || "Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Network error");
    }
  };

  return (
    <div className="rooms-container">
      <div className="left-info">
        <h3>
          ROOMS are feature provided by <strong>HealthHub</strong>
        </h3>
        <p>
          It is a Chat-Box where you can add your doctor and pathologist by
          their ID, then chat with them, share old reports, and receive
          prescriptions and reports.
        </p>
        <p>
          This chatBox can be specific to anything like Heart Problems or Kidney
          Cancer.
        </p>
        <p>
          <em>Use Case: Personalized Health Collaboration</em>
        </p>
      </div>

      <div className="right-rooms">
        {rooms.length === 0 ? (
          <div className="no-rooms-message">
            <h3>No rooms created yet 🛏️</h3>
            <p>
              Click the <FaPlus /> button below to create your first room.
            </p>
          </div>
        ) : (
          rooms.map((room, i) => (
            <div key={i} className="room-card fade-in">
              <div className="room-header">
                <span className="room-name">{room.roomName}</span>
                <span className="room-doc">{room.doctor}</span>
              </div>
              <div className="room-meta">
                <small>
                  Created on: {new Date(room.createdOn).toLocaleDateString()}
                </small>
                <span
                  className="delete-icon"
                  title="Delete room"
                  onClick={() => {
                    console.log(room);

                    handleDelete(room._id);
                  }}
                >
                  🗑️
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="floating-button" onClick={() => setShowModal(true)}>
        <FaPlus />
      </button>
      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onRoomCreated={fetchRooms}
        />
      )}
    </div>
  );
};

export default RoomsDashboard;
