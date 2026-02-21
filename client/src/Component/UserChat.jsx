import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { Send, MessageCircle, Shield } from "lucide-react";

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);
  const [assignedAdminId, setAssignedAdminId] = useState(null);
  const [chatEnabled, setChatEnabled] = useState(false);

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

  // 🔥 CHECK IF APPLICATION ACCEPTED
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
      } else {
        setChatEnabled(false);
      }
    } catch (error) {
      console.error("Chat status error:", error);
    }
  };

  // 🔥 CONNECT SOCKET
  const connectSocket = (userId) => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.emit("join_user", userId);

    newSocket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect();
  };

  // 🔥 FETCH HISTORY
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

  // 🔥 SEND MESSAGE
  const handleSend = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !chatEnabled) return;

    const messageData = {
      senderId: userId,
      receiverId: assignedAdminId,  // 🔥 IMPORTANT
      message: newMessage,
    };

    socket.emit("send_message_to_admin", messageData);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 IF NOT ACCEPTED
  if (!chatEnabled) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500 text-center px-4">
        <div>
          <MessageCircle className="mx-auto mb-3 opacity-40" size={40} />
          <p>
            Chat will be available once your application is accepted by the admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border">

      {/* Header */}
      <div className="bg-blue-600 p-4 text-white font-bold">
        Chat with Assigned Admin
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isUser = msg.senderModel === "User";

          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  isUser ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default UserChat;
