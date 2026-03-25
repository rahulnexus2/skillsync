import Job from '../models/JobModel.js'

export const viewJob=async(req,res)=>{

  try{
    const jobs = await Job.find();
    res.status(200).json(jobs)
  }
  catch(error)
  {
    res.status(502).json({message:"something went wrong",error:error.message})
  }

}