import Admin from "../models/AdminModel.js";
import bcrypt from "bcryptjs";
import config from "../config/config.js";


export const adminSignup = async (req, res) => {
  try {
    const { username, email, password, adminkey } = req.body;

    if (adminkey !== config.adminKey) {
 return res.status(400).json({ success: false, message: "Cannot register as admin, invalid key" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashPass,
      role:"admin"
      
    });


    await newAdmin.save();

    res.status(201).json({
      message: "admin registered sucessfully",
      id: newAdmin.id,
      email: newAdmin.email,
    
    });
  
   } catch (error) {
    res.status(500).json({
       message: "server error ",
        error: error.message });
  }
};
