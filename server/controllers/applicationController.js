import Application from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";

// User: Apply for a job
export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const application = await Application.create({
            jobId,
            userId,
        });

        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Admin: Get applications for jobs posted by this admin
export const getAdminApplications = async (req, res) => {
    try {
        const adminId = req.admin._id;

        // Find all jobs posted by this admin
        const jobs = await Job.find({ "postedBy.id": adminId });
        const jobIds = jobs.map((job) => job._id);

        // Find applications for these jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate("jobId", "jobTitle company")
            .populate("jobId", "jobTitle company")
            .populate("userId", "username email education skills projects") // Populating username, education, skills, and projects
            .sort({ appliedAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Admin: Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params; // Application ID
        const { status } = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ message: "Status updated", application });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
