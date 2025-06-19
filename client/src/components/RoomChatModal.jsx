// RoomChat.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthAutorization";
import "../css/RoomChatModal.css";

const RoomChat = ({ roomId, roomData, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/chat/${roomId}`);
      console.log(res.data);

      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage && !file) {
      toast.warn("Please type a message or upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("text", newMessage);
    formData.append("roomId", roomId);
    formData.append("sentBy", user.id);
    formData.append("senderName", user.name);
    formData.append("senderRole", user.role);
    formData.append("patientId", roomData.createdBy);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/chat/send", formData);
      if (!(res.status === 200)) {
        toast.error(res.error || "Something Went Wrong");
        return;
      }
      setMessages((prev) => [...prev, res.data]);

      setNewMessage("");
      setFile(null);
    } catch (err) {
      toast.error("Send failed");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Blurred Backdrop */}
      <div className="chat-backdrop" onClick={onClose}></div>

      {/* Chat Popup */}
      <div className="chat-popup">
        <div className="chat-header">
          <h4>{roomData.roomName}</h4>
          <p>
            Doctor: Dr. {roomData.doctor} | Pathologist: Dr.{" "}
            {roomData.pathology}
          </p>
          <button className="close-btn" onClick={onClose}>
            ❌
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${
                msg.sentBy === user.id ? "sent" : "received"
              }`}
            >
              <p className="sender">{msg.senderName}</p>
              {msg.text && <p>{msg.text}</p>}
              {msg.file && (
                <a
                  href={`/${msg.file.filepath.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                >
                  📄 Download PDF
                </a>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </>
  );
};

export default RoomChat;
