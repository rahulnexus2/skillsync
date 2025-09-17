import Job from '../models/JobModel.js'

export const viewJob=async(req,res)=>{

  try{
    const jobs = await Job.find();
    console.log(jobs)
    res.status(202).json(jobs)
  }
  catch(error)
  {
    res.status(502).json({message:"something went wrong",error:error.message})
  }

}