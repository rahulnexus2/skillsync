import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../utils/axiosInstance";
import { Send, MessageCircle, Search, Loader } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    const decoded = jwtDecode(token);
    newSocket.emit("join_admin", decoded.id);

    newSocket.on("receive_message", (message) => {
      const currentUser = selectedUserRef.current;
      if (currentUser && (
        message.senderId?.toString() === currentUser._id?.toString() ||
        message.receiverId?.toString() === currentUser._id?.toString()
      )) {
        setMessages((prev) => [...prev, message]);
      }
    });

    fetchUsers(token);
    return () => newSocket.disconnect();
  }, []);

  const fetchUsers = async (token) => {
    try {
      const res = await axiosInstance.get("/admin/chat/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchHistory = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axiosInstance.get(`/admin/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchHistory(user._id);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedUser) return;
    const token = localStorage.getItem("adminToken");
    try {
      const decoded = jwtDecode(token);
      socket.emit("send_message_to_user", {
        senderId: decoded.id,
        receiverId: selectedUser._id,
        message: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(u =>
        `${u.username || ""} ${u.email || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [searchTerm, users]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "24px 16px", maxWidth: 1100, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .user-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; border-radius: 12px; transition: background 0.15s; }
        .user-row:hover { background: #f5f3ff; }
        .user-row.active { background: #ede9fe; }
        .msg-input { flex: 1; padding: 11px 16px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
        .msg-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .send-btn { width: 44px; height: 44px; background: linear-gradient(135deg, #6366f1, #7c3aed); border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.2s; flex-shrink: 0; }
        .send-btn:hover { opacity: 0.9; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .search-input { width: 100%; padding: 9px 12px 9px 36px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; box-sizing: border-box; }
        .search-input:focus { border-color: #6366f1; background: white; }
        .bubble-admin { background: linear-gradient(135deg, #6366f1, #7c3aed); color: white; border-radius: 18px 18px 4px 18px; padding: 10px 16px; max-width: 70%; }
        .bubble-user { background: white; border: 1px solid #ede9fe; color: #1e1b4b; border-radius: 18px 18px 18px 4px; padding: 10px 16px; max-width: 70%; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>Messages</h1>
        <p style={{ fontSize: 14, color: "#94a3b8" }}>Chat with accepted applicants</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, height: 580 }}>

        {/* Sidebar */}
        <div style={{ background: "white", border: "1px solid #ede9fe", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                className="search-input"
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {loadingUsers ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 24, color: "#6366f1" }}>
                <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 16px", color: "#94a3b8" }}>
                <MessageCircle size={28} style={{ margin: "0 auto 8px", opacity: 0.3, display: "block" }} />
                <p style={{ fontSize: 13 }}>No accepted applicants yet</p>
              </div>
            ) : filteredUsers.map(user => (
              <div
                key={user._id}
                className={`user-row ${selectedUser?._id === user._id ? "active" : ""}`}
                onClick={() => handleUserSelect(user)}
              >
                <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600, fontSize: 15, flexShrink: 0 }}>
                  {(user.username || user.email || "U")[0].toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b", margin: 0, textTransform: "capitalize" }}>{user.username}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ background: "white", border: "1px solid #ede9fe", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600, fontSize: 15 }}>
                  {(selectedUser.username || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1e1b4b", margin: 0, textTransform: "capitalize" }}>{selectedUser.username}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{selectedUser.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12, background: "#fafafa" }}>
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", textAlign: "center" }}>
                    <MessageCircle size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                    <p style={{ fontSize: 14 }}>No messages yet. Start the conversation!</p>
                  </div>
                ) : messages.map((msg, idx) => {
                  const isAdmin = msg.senderModel === "Admin";
                  return (
                    <div key={idx} style={{ display: "flex", justifyContent: isAdmin ? "flex-end" : "flex-start" }}>
                      <div>
                        <div className={isAdmin ? "bubble-admin" : "bubble-user"}>
                          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{msg.message}</p>
                        </div>
                        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, textAlign: isAdmin ? "right" : "left" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "14px 16px", borderTop: "1px solid #f1f5f9", background: "white" }}>
                <form onSubmit={handleSend} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    className="msg-input"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button className="send-btn" type="submit" disabled={!newMessage.trim()}>
                    <Send size={16} color="white" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", textAlign: "center" }}>
              <MessageCircle size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15, color: "#94a3b8" }}>Select a user to start chatting</p>
              <p style={{ fontSize: 13, color: "#cbd5e1", marginTop: 4 }}>Only accepted applicants appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;