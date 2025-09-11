import { Routes, Route, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import { Routes, Route, Navigate } from "react-router-dom";

import { UserSignup } from "../pages/UserSignup";
import { UserLogin } from "../pages/UserLogin";

import { AdminSignup } from "../pages/AdminSignup";
import { AdminLogin } from "../pages/AdminLogin";
import {AdminLayout}  from "../Layouts/AdminLayout"

import AdminAbout from '../Component/AdminAbout'
import Jobs from '../Component/Jobs'
import Quizes from '../Component/Quizes'
import AdminChat from '../Component/AdminChat'


import UesrAbout from '../Component/UserAbout'
import Jobs from '../Component/Jobs'
import Quizes from '../Component/Quizes'
import UserChat from '../Component/UserChat'



import React from 'react'

const RouteConfig = () => {
  return (
    <div>
      <Routes>
        // public routes
        <Route path="user/login" element={<UserLogin/>}></Route>
        <Route path="user/signup" element={<UserSignup/>}></Route>
        <Route path="admin/login" element={<AdminLogin/>}></Route>
        <Route path="admin/signup" element={<AdminSignup/>}></Route>

      // admin protected routes
      <Route path="admin">
      <Route path="dashboard" element={<AdminLayout/>}></Route>
      <Route path="about" element={<AdminAbout/>}></Route>
      <Route path="jobs" element={<Jobs/>}></Route>
      <Route path="quizes" element={<Quizes/>}></Route>
      <Route path="adminchat" element={<AdminChat/>}></Route>
      </Route>

      </Routes>
      
    </div>
  )
}

export default routeconfig
