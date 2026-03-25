import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { Send, MessageCircle, Loader } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

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
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      checkChatStatus();
    } catch (error) {
      console.error("Invalid token", error);
      setLoading(false);
    }
  }, []);

  const checkChatStatus = async () => {
    try {
      const res = await axiosInstance.get("/users/application/chat-status");

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

  useEffect(() => {
    if (!chatEnabled) return;

    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/users/chat");
        setMessages(res.data);
      } catch (error) {
        console.error("History fetch error:", error);
      }
    };

    fetchHistory();
  }, [chatEnabled]);

  useEffect(() => {
    if (!chatEnabled || !userId) return;

    const token = localStorage.getItem("token");
    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    setSocket(newSocket);

    newSocket.emit("join_user", userId);

    newSocket.on("receive_message", (message) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.message === message.message &&
            m.senderModel === message.senderModel &&
            m._id === undefined
        );
        if (isDuplicate) {
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

  const handleSend = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !chatEnabled) return;

    const msgObj = {
      senderId: userId,
      receiverId: assignedAdminId,
      message: newMessage,
      senderModel: "User",
    };

    socket.emit("send_message_to_admin", msgObj);

    setMessages((prev) => [...prev, msgObj]);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Checking chat access…</p>
      </div>
    );
  }

  if (!chatEnabled) {
    return (
      <div className="mx-auto max-w-md">
        <PageHeader
          title="Messages"
          description="Chat unlocks when a recruiter accepts your application."
        />
        <div className="card-panel flex flex-col items-center px-6 py-16 text-center">
          <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="font-medium text-foreground">Chat not available yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Apply to roles and wait for an acceptance to message the team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <PageHeader
        title="Messages"
        description="Conversation with your assigned recruiter."
      />

      <div className="card-panel flex flex-col overflow-hidden" style={{ minHeight: "420px" }}>
        <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4 sm:p-5">
          {messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. Say hello below.
            </p>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.senderModel === "User";
              return (
                <div
                  key={msg._id || index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border border-border bg-card text-foreground"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex gap-2 border-t border-border bg-card p-3 sm:p-4"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message…"
            className="input-ctrl flex-1"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserChat;
