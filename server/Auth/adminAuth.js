import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";
import Job from "../models/JobModel.js";

export const adminAuth = async(req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; 

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(403).json({ messsage: "Admin not found" });
  
    req.admin = admin;

  
    next()
  
  }
  catch(error)
  {
    res.status(401).json({ message: "Invalid token", error: error.message })

  }

}


