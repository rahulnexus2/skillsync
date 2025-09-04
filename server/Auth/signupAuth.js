import User from "../models/UserModel.js"


export const signupAuth=async(req,res,next)=>{
  console.log(req.body)
  try{
  const {email}=req.body;


  const existingUser=await User.findOne({email});
  
  if(existingUser){
    return res.status(400).json({
    message:"user is already registered"});
    }
 
  next();
  }
  catch(error)
  {
    res.status(500).json({
       message: "Server error",
        error: error.message 
      });
  }
  }













