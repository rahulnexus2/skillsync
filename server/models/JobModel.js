import Mongoose from 'mongoose'

const jobSchema =new Mongoose.Schema({

  
      jobTitle:{ type: String, required: [true,"job title is required"] },
      company: { type: String, required: [true,"company name is required"] },
      jobDescription:{ type: String,required: [true,"job description is required"] },
      jobType:{
        required: [true,"please specify job type"],
        type:String,
        enum:["fulltime","parttime","internship","remote"]
      },
      jobPost:{ type: String, required: [true,"job post is required"]},
      location:{ type: String, required: [true,"location is required"] },
      skills:{type:[String],required: [true,"skill feild is empty"]},
      deadline:{type:Date},
       postedBy: { 
         id: { type: Mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
         username: { type: String, required: true } 
       },


    

})

const jobModel=Mongoose.model("jobModel",jobSchema);


export default jobModel;