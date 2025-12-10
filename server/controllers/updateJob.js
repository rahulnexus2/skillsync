
import Job from "../models/JobModel.js";

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params; 
    const updates = req.body;  

    
    const updatedJob = await Job.findByIdAndUpdate(id, updates, {
      new: true,          
      runValidators: true 
    });

    if (!updatedJob) {
      return res.status(404).json({ success:false, message:"Job not found"});
    }

    res.status(200).json({
      success:true,
      message:"Job updated successfully",
      data:updatedJob
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Error updating job",
      error:error.message
    });
  }
};
