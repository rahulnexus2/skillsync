import jobModel from '../models/JobModel.js'


export const createJob=async(req,res)=>{
  try{
      const {
        jobTitle,
        company,
        jobDescription,
        jobType,
        jobPost,
        location,
        skills,
        deadline
      } = req.body;

      const {_id,username}=req.admin;
      
      const newJob=new jobModel({
        jobTitle,
        company,
        jobDescription,
        jobType,
        jobPost,
        location,
        skills,
        deadline,
        postedBy:{
          id: _id,
        username: username

        }
      })

      await newJob.save()

      res.status(201).json({msg:"job created sucessfully"})

  }
  catch(error)
  {
      console.log(error)
      res.status(502).json(
        {msg:"cannot create job"
        ,error:error.message}
      )}
}