import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import CreateRoomModal from "../components/CreateRoomModal";
import { useNavigate } from "react-router-dom";
import "../css/RoomDash.css";
import { useAuth } from "../components/AuthAutorization";
import RoomChatModal from "../components/RoomChatModal";

const RoomsDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Fetch Rooms
  const fetchRooms = async () => {
    if (!user || !user.id || !user.role) return;

    try {
      let link = `http://localhost:8000/rooms?createdby=${user.id}`;
      if (user.role === "doctor") {
        link = `http://localhost:8000/rooms?doctorId=${user.id}`;
      }
      if (user.role === "pathologist") {
        link = `http://localhost:8000/rooms?pathologyId=${user.id}`;
      }

      const response = await fetch(link);
      const data = await response.json();

      if (response.status === 200) {
        const mappedRooms = data.map((item) => ({
          _id: item._id,
          roomName: item.roomName,
          doctor: item.doctor,
          doctorId: item.doctorId,
          pathologyId: item.pathologyId,
          createdOn: item.createdOn,
          pathology: item.pathology,
          mobile: item.mobilenumber,
          createdBy: item.createdby,
        }));
        setRooms(mappedRooms);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to fetch rooms");
      console.error("Room fetch error:", error);
    }
  };

  // Initial effect
  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please login first");
      navigate("/login", { replace: true });
      return;
    }

    fetchRooms();
  }, [loading, user]);

  // Handle delete
  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(`http://localhost:8000/rooms/${roomId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.status === 200) {
        toast.success("Room deleted");
        fetchRooms();
      } else {
        toast.error(result.error || "Failed to delete room");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error");
    }
  };

  // Guard: Don't render anything while loading
  if (loading) return null;

  return (
    <div className="rooms-container">
      <div className="left-info">
        <h3>
          ROOMS are feature provided by <strong>HealthHub</strong>
        </h3>
        <p>
          Add your doctor and pathologist by their ID, then chat, share old
          reports, and receive prescriptions and updates. This can be
          disease-specific like "Heart Problems" or "Kidney Cancer".
        </p>
      </div>

      <div className="right-rooms">
        {rooms.length === 0 ? (
          <div className="no-rooms-message">
            <h3>No rooms created yet 🛏️</h3>
            {user?.role === "patient" && (
              <p>
                Click the <FaPlus /> button below to create your first room.
              </p>
            )}
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              className="room-card fade-in"
              onClick={() => setActiveRoom(room)}
            >
              <div className="room-header">
                <span className="room-name">{room.roomName}</span>
                <span className="room-doc">Dr. {room.doctor}</span>
              </div>
              <div className="room-meta">
                <small>
                  Created on:{" "}
                  {new Date(room.createdOn).toLocaleDateString("en-IN")}
                </small>
                <span
                  className="delete-icon"
                  title="Delete room"
                  onClick={() => handleDelete(room._id)}
                >
                  🗑️
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {user?.role === "patient" && (
        <button className="floating-button" onClick={() => setShowModal(true)}>
          <FaPlus />
        </button>
      )}

      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onRoomCreated={fetchRooms}
        />
      )}
      {activeRoom && (
        <RoomChatModal
          roomId={activeRoom._id}
          roomData={activeRoom}
          doctorName={activeRoom.doctor}
          pathologyName={activeRoom.pathology || "N/A"}
          onClose={() => setActiveRoom(null)}
        />
      )}
    </div>
  );
};

export default RoomsDashboard;
