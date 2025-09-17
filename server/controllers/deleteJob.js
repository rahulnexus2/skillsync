
import Job from "../models/JobModel.js";

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: deletedJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting job",
      error: error.message
    });
  }
};
