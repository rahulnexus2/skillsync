import Admin from "../models/AdminModel.js";
import Job from "../models/JobModel.js";

export const getAdminStats = async (req, res) => {
    try {
        const adminId = req.admin.id;


        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const jobCount = await Job.countDocuments({ "postedBy.id": adminId });

        res.status(200).json({
            admin,
            stats: {
                jobsPosted: jobCount,
                quizzesCreated: 0,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const { username, phoneNumber } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { username, phoneNumber },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
