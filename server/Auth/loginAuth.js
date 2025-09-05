
import User from "../models/UserModel.js"
import bcrypt from "bcryptjs";


export const loginAuth=async(req,res,next)=>{
  try{

  const { email,password }=req.body;
  const existingUser=await User.findOne({email})


  if(!existingUser){

    return res.status(500).json({
      message:"Not a registered user"
    })

  }

  const isMatch=await bcrypt.compare(
    password,existingUser.password
  );
  
  if(!isMatch){

    return res.status(500).json({
      message:"invalid email or password"
    })

  }

  req.user=existingUser;

  next();
  
}
  catch(error)
  {
     res.status(500).json({
      message:"server error",
      error:error.message
    });
  }
}