import express from 'express'

import {userSignup} from "../controllers/userSignup.js";
import {signupAuth} from  "../Auth/signupAuth.js"
const router=express.Router();


router.post("/signup",signupAuth,userSignup);
//router.post("/login",userLogin);
  

export default router;