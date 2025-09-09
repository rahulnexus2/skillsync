import { useState } from "react";

import { BrowserRouter } from "react-router-dom";
import { AuthRoutes } from "./routes/AuthRoutes";
import AdminDashboard  from './Dashboards/AdminDashboard'
function App() {
  return (
    <>
      <BrowserRouter>
      <AdminDashboard></AdminDashboard>
        {/* <AuthRoutes></AuthRoutes> */}
      </BrowserRouter>
    </>
  );
}

export default App;
