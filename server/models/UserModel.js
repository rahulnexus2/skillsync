const Mongoose=require("mongoose");

const userSchema=new Mongoose.Schema({
  email:{
    type:String,
    unique:true,
    required:true,
    lowercase:true,
    trim:true
  },
  password:{
    type:String,
    required:true,
    trim:true,
  },
   otp: {
    type: String, 
  },

  otpExpires: {
    type: Date, 
  },

  isVerified: {
    type: Boolean,
    default: false, 
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User=Mongoose.models("User",userSchema)||Mongoose.models.User;


export default User;