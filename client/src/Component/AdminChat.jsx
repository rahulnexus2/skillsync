import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../utils/axiosInstance';
import { Send, MessageCircle, Search } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // ===============================
  // SOCKET CONNECTION
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

   const decoded = jwtDecode(token);
  newSocket.emit("join_admin", decoded.id);


    newSocket.on('receive_message', (message) => {
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

  // ===============================
  // FETCH USERS
  // ===============================
  const fetchUsers = async (token) => {
    try {
      const res = await axiosInstance.get('/admin/chat/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // ===============================
  // FETCH CHAT HISTORY
  // ===============================
  const fetchHistory = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axiosInstance.get(`/admin/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
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

  // ===============================
  // SEND MESSAGE
  // ===============================
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedUser) return;

    const token = localStorage.getItem('adminToken');

    try {
      const decoded = jwtDecode(token);
      const adminId = decoded.id;

      const messageData = {
        senderId: adminId,
        receiverId: selectedUser._id,
        message: newMessage,
      };

      socket.emit('send_message_to_user', messageData);
      setNewMessage('');
    } catch (error) {
      console.error("Error decoding token", error);
    }
  };

  // ===============================
  // SEARCH LOGIC (FIXED)
  // ===============================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        const fullText = `${user.name || ""} ${user.email || ""}`.toLowerCase();
        return fullText.includes(searchTerm.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

      {/* Sidebar */}
      <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">

        <div className="p-4 bg-white border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>

          <div className="relative">
            <Search className="absolute top-3 left-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-white transition ${
                selectedUser?._id === user._id ? 'bg-white shadow-sm border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[150px]">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">

        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold">
                {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <h2 className="font-bold text-slate-800">
                {selectedUser.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => {
                const isAdmin = msg.senderModel === 'Admin';

                return (
                  <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl ${
                      isAdmin
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border rounded-tl-none'
                    }`}>
                      <p>{msg.message}</p>
                      <span className="text-[10px] block mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a user to start chatting</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminChat;
