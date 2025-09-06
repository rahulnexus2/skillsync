import Mongoose from "mongoose";


const adminSchema=new Mongoose.Schema({

username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },


  email:{
    type:String,
    unique: true,
      required: true,
      lowercase: true,
      trim: true,
  },

  password:{
    type:String,
    required:true,
    
    trim: true,
  }




})

const Admin=Mongoose.model("Admin",adminSchema)||Mongoose.models.Admin



export default Admin