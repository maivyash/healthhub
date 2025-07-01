import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthAutorization";
import { toast } from "react-toastify";
import "../css/RoomChatModal.css"; // we’ll update this too

const RoomChat = ({ roomId, roomData, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER}/chat/${roomId}`
      );
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage && !file)
      return toast.warn("Type message or upload a file");

    const formData = new FormData();
    formData.append("text", newMessage);
    formData.append("roomId", roomId);
    formData.append("sentBy", user.id);
    formData.append("doctorId", roomData.doctorId);
    formData.append("pathologyId", roomData.pathologyId);
    formData.append("senderName", user.name);
    formData.append("senderRole", user.role);
    formData.append("patientId", roomData.createdBy);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER}/chat/send`,
        formData
      );
      if (res.status === 200) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
        setFile(null);
      }
    } catch {
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
      <div className="chat-modal-backdrop" onClick={onClose}></div>
      <div className="chat-modal">
        <div className="chat-left">
          <div className="chat-header">
            <h2>Dr. {roomData.doctor}</h2>
          </div>

          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${
                  msg.sentBy === user.id ? "sent" : "received"
                }`}
              >
                <div className="chat-sender">{msg.senderName}</div>
                {msg.text && <p>{msg.text}</p>}
                {msg.file && (
                  <a
                    href={`/${msg.file.filepath.replace(/\\/g, "/")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-download"
                  >
                    📄 {msg.file.filename || "View File"}
                  </a>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-bar">
            <input
              type="text"
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={sendMessage}>Send ➤</button>
          </div>
        </div>

        <div className="chat-right">
          <div className="patient-profile">
            <img src="/default-avatar.png" alt="avatar" className="avatar" />
            <h4>{user.name}</h4>
            <p>{user.role}</p>
          </div>

          <div className="shared-documents">
            <h5>Shared Documents</h5>
            {messages
              .filter((m) => m.file)
              .map((m, i) => (
                <div key={i} className="doc-item">
                  <span>{new Date().toDateString()}</span>
                  <a
                    href={`/${m.file.filepath.replace(/\\/g, "/")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {m.file.filename}
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomChat;
