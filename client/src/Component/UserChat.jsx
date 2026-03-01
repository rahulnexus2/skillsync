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

  /* ============================= */
  /* ✅ Decode Token + Check Status */
  /* ============================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      checkChatStatus(token);
    } catch (error) {
      console.error("Invalid token", error);
      setLoading(false);
    }
  }, []);

  /* ============================= */
  /* ✅ Check Chat Enabled          */
  /* ============================= */
  const checkChatStatus = async (token) => {
    try {
      const res = await axiosInstance.get("/users/application/chat-status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.chatEnabled) {
        setChatEnabled(true);
        setAssignedAdminId(res.data.assignedAdminId);
      }
    } catch (error) {
      console.error("Chat status error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* ✅ Fetch Chat History          */
  /* ============================= */
  useEffect(() => {
    if (!chatEnabled) return;

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/users/chat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (error) {
        console.error("History fetch error:", error);
      }
    };

    fetchHistory();
  }, [chatEnabled]);

  /* ============================= */
  /* ✅ Connect Socket After History */
  /* ============================= */
  useEffect(() => {
    if (!chatEnabled || !userId) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.emit("join_user", userId);

    newSocket.on("receive_message", (message) => {
      // Avoid duplicates: skip if this message was already added optimistically
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.message === message.message &&
            m.senderModel === message.senderModel &&
            m._id === undefined // optimistic messages won't have _id
        );
        if (isDuplicate) {
          // Replace the optimistic message with the real one from server
          return prev.map((m) =>
            m.message === message.message &&
            m.senderModel === message.senderModel &&
            m._id === undefined
              ? message
              : m
          );
        }
        return [...prev, message];
      });
    });

    return () => newSocket.disconnect();
  }, [chatEnabled, userId]);

  /* ============================= */
  /* ✅ Send Message                */
  /* ============================= */
  const handleSend = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !chatEnabled) return;

    const msgObj = {
      senderId: userId,
      receiverId: assignedAdminId,
      message: newMessage,
      senderModel: "User", // used for alignment in UI
    };

    socket.emit("send_message_to_admin", msgObj);

    // Optimistically add message so sender sees it immediately
    setMessages((prev) => [...prev, msgObj]);
    setNewMessage("");
  };

  /* ============================= */
  /* ✅ Auto Scroll                 */
  /* ============================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ============================= */
  /* 🔄 Loading State              */
  /* ============================= */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 12,
          color: "#6366f1",
        }}
      >
        <Loader size={20} />
        <span>Checking chat status...</span>
      </div>
    );

  /* ============================= */
  /* 🚫 Chat Disabled              */
  /* ============================= */
  if (!chatEnabled)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <MessageCircle size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
          <h3>Chat Not Available Yet</h3>
          <p>Chat will unlock once an admin accepts your job application.</p>
        </div>
      </div>
    );

  /* ============================= */
  /* 💬 Chat UI                    */
  /* ============================= */
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Chat with Admin</h2>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Messages */}
        <div
          style={{
            height: 450,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "#fafafa",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              No messages yet.
            </p>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.senderModel === "User";
              return (
                <div
                  key={msg._id || index}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      background: isUser ? "#6366f1" : "white",
                      color: isUser ? "white" : "#111",
                      padding: "10px 14px",
                      borderRadius: 12,
                      maxWidth: "70%",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          style={{
            display: "flex",
            gap: 10,
            padding: 16,
            borderTop: "1px solid #eee",
            background: "white",
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            style={{
              padding: "0 16px",
              background: newMessage.trim() ? "#6366f1" : "#c7d2fe",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: newMessage.trim() ? "pointer" : "not-allowed",
              transition: "background 0.2s",
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserChat;