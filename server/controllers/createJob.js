import Job from '../models/JobModel.js'


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
      
      const newJob=new Job({
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

      res.status(201).json({messsage:"job created sucessfully"})

  }
  catch(error)
  {
      console.log(error)
      res.status(502).json(
        {
          messsage:"cannot create job"
        ,error:error.message
      }
      )}
}