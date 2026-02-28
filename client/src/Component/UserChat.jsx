import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { Send, MessageCircle, Loader } from "lucide-react";

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);
  const [assignedAdminId, setAssignedAdminId] = useState(null);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      checkChatStatus(token, decoded.id);
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, []);

  const checkChatStatus = async (token, userId) => {
    try {
      const res = await axiosInstance.get("/users/application/chat-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.chatEnabled) {
        setChatEnabled(true);
        setAssignedAdminId(res.data.assignedAdminId);
        connectSocket(userId);
        fetchHistory(token);
      }
    } catch (error) {
      console.error("Chat status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = (userId) => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    newSocket.emit("join_user", userId);
    newSocket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => newSocket.disconnect();
  };

  const fetchHistory = async (token) => {
    try {
      const res = await axiosInstance.get("/users/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.error("History fetch error:", error);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !chatEnabled) return;
    socket.emit("send_message_to_admin", {
      senderId: userId,
      receiverId: assignedAdminId,
      message: newMessage,
    });
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, color: "#6366f1", fontFamily: "'DM Sans', sans-serif" }}>
      <Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
      <span>Checking chat status...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!chatEnabled) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ width: 72, height: 72, background: "#f5f3ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <MessageCircle size={32} color="#a78bfa" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e1b4b", marginBottom: 8 }}>Chat Not Available Yet</h3>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>
          Chat will be unlocked once an admin accepts your job application. Check your application status in your profile.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .msg-input { flex: 1; padding: 12px 16px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
        .msg-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .send-btn { width: 44px; height: 44px; background: linear-gradient(135deg, #6366f1, #7c3aed); border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.2s; flex-shrink: 0; }
        .send-btn:hover { opacity: 0.9; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .message-bubble-user { background: linear-gradient(135deg, #6366f1, #7c3aed); color: white; border-radius: 18px 18px 4px 18px; padding: 10px 16px; max-width: 70%; }
        .message-bubble-admin { background: white; border: 1px solid #ede9fe; color: #1e1b4b; border-radius: 18px 18px 18px 4px; padding: 10px 16px; max-width: 70%; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>Chat with Admin</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
          <span style={{ fontSize: 13, color: "#64748b" }}>Connected to your assigned admin</span>
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ background: "white", border: "1px solid #ede9fe", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(99,102,241,0.08)" }}>

        {/* Messages Area */}
        <div style={{ height: 480, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 12, background: "#fafafa" }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", textAlign: "center" }}>
              <MessageCircle size={36} style={{ marginBottom: 8, opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.senderModel === "User";
              return (
                <div key={index} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div>
                    <div className={isUser ? "message-bubble-user" : "message-bubble-admin"}>
                      <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{msg.message}</p>
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, textAlign: isUser ? "right" : "left" }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", background: "white" }}>
          <form onSubmit={handleSend} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              className="msg-input"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="send-btn" type="submit" disabled={!newMessage.trim()}>
              <Send size={18} color="white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserChat;