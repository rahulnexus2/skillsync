import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../utils/axiosInstance";
import { Send, MessageCircle, Search, Loader } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { PageHeader } from "../components/PageHeader";

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

    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    setSocket(newSocket);

    const decoded = jwtDecode(token);
    newSocket.emit("join_admin", decoded.id);

    newSocket.on("receive_message", (message) => {
      const currentUser = selectedUserRef.current;
      if (
        currentUser &&
        (message.senderId?.toString() === currentUser._id?.toString() ||
          message.receiverId?.toString() === currentUser._id?.toString())
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    fetchUsers(token);
    return () => newSocket.disconnect();
  }, []);

  const fetchUsers = async (token) => {
    try {
      const res = await axiosInstance.get("/admin/chat/users");
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
      const res = await axiosInstance.get(`/admin/chat/${userId}`);
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
      setFilteredUsers(
        users.filter((u) =>
          `${u.username || ""} ${u.email || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <PageHeader
        title="Messages"
        description="Only candidates you’ve accepted are listed here."
      />

      <div className="card-panel flex flex-col overflow-hidden lg:min-h-[520px] lg:flex-row">
        <div className="flex w-full flex-col border-b border-border lg:w-72 lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-ctrl pl-9 text-sm"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto lg:max-h-none lg:flex-1">
            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <Loader className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No accepted applicants yet</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50 ${
                    selectedUser?._id === user._id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {(user.username || user.email || "U")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium capitalize text-foreground">{user.username}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex min-h-[320px] flex-1 flex-col">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {(selectedUser.username || "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold capitalize text-foreground">
                    {selectedUser.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-muted/15 p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <MessageCircle className="mb-2 h-8 w-8 opacity-40" />
                    <p className="text-sm">Start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isAdmin = msg.senderModel === "Admin";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[85%]">
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm ${
                              isAdmin
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border bg-card text-foreground"
                            }`}
                          >
                            {msg.message}
                          </div>
                          {msg.createdAt && (
                            <p
                              className={`mt-1 text-[10px] text-muted-foreground ${
                                isAdmin ? "text-right" : "text-left"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="flex gap-2 border-t border-border bg-card p-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message…"
                  className="input-ctrl flex-1"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
              <MessageCircle className="h-10 w-10 opacity-30" />
              <p className="text-sm font-medium text-foreground">Select a candidate</p>
              <p className="text-xs">Choose someone from the list to read and send messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
