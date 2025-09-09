import React from 'react'
import {Routes ,Route,Navigate} from 'react-router-dom'
import AdminDashLayout from '../Layouts/AdminDashLayout'

import AdminAbout from '../Component/AdminAbout'
import Jobs from '../Component/Jobs'
import Quizes from '../Component/Quizes'
import AdminChat from '../Component/AdminChat'

const AdminDashboard = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigate to="/admin" replace />}/>
        <Route path='/admin' element={<AdminDashLayout/>}>
        <Route index element ={<Navigate to="profile" replace/>} />
        <Route path='profile' element={<AdminAbout/>}/>
        <Route path='jobs' element={<Jobs/>}/>
        <Route path="quizes" element={<Quizes/>}/>
        <Route path="chatroom" element={<AdminChat/>}/>
        <Route />
        </Route>
      </Routes>
      
    </div>
  )
}

export default AdminDashboard
