import Application from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

// ===============================
// USER: APPLY FOR JOB
// ===============================
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const application = await Application.create({ jobId, userId });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error("Apply job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ADMIN: GET APPLICATIONS
// ===============================
export const getAdminApplications = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.admin._id);

    const jobs = await Job.find({ "postedBy.id": adminId });

    const jobIds = jobs.map((job) => job._id);

    if (jobIds.length === 0) {
      return res.status(200).json([]);
    }

    const applications = await Application.find({
      jobId: { $in: jobIds },
    })
      .populate("jobId", "jobTitle company")
      .populate("userId", "username email phone education skills projects")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (error) {
    logger.error("Get admin applications error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================
// ADMIN: UPDATE STATUS
// ===============================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;

    if (status === "accepted") {
      application.assignedAdminId = req.admin._id;
    }

    if (status === "rejected") {
      application.assignedAdminId = null;
    }

    await application.save();

    res.status(200).json({
      message: "Status updated successfully",
      application,
    });

  } catch (error) {
    logger.error("Update status error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// USER: CHECK CHAT STATUS
// ===============================
export const getChatStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const acceptedApplication = await Application.findOne({
      userId,
      status: "accepted",
      assignedAdminId: { $ne: null },
    });

    if (!acceptedApplication) {
      return res.status(200).json({ chatEnabled: false });
    }

    return res.status(200).json({
      chatEnabled: true,
      assignedAdminId: acceptedApplication.assignedAdminId,
    });

  } catch (error) {
    logger.error("Chat status error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};










