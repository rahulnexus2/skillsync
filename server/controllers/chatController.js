import { Message } from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Application from "../models/ApplicationModel.js";

// ===============================
// Admin: Get only users assigned to this admin
// ===============================
export const getUsersForChat = async (req, res) => {
  try {
    const adminId = req.admin._id;

    // Find applications accepted by this admin
    const applications = await Application.find({
      assignedAdminId: adminId,
      status: "accepted",
    }).populate("userId", "username email _id");

    const users = applications.map(app => app.userId);

    res.status(200).json(users);

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ===============================
// Admin: Get chat history with assigned user
// ===============================
export const getAdminChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.admin._id;

    
    const application = await Application.findOne({
      userId,
      assignedAdminId: adminId,
      status: "accepted",
    });

    if (!application) {
      return res.status(403).json({
        message: "Chat not allowed. You are not assigned to this user."
      });
    }

    const messages = await Message.find({
      $or: [
        {
          senderId: userId,
          senderModel: "User",
          receiverModel: "Admin",
        },
        {
          receiverId: userId,
          senderModel: "Admin",
          receiverModel: "User",
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching admin chat history:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
};


export const getUserChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    
    const application = await Application.findOne({
      userId,
      status: "accepted",
    });

    if (!application) {
      return res.status(403).json({
        message: "Chat not available until application is accepted."
      });
    }

    const messages = await Message.find({
      $or: [
        {
          senderId: userId,
          senderModel: "User",
          receiverModel: "Admin",
        },
        {
          receiverId: userId,
          senderModel: "Admin",
          receiverModel: "User",
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching user chat history:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
};
