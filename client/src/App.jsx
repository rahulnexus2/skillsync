import { useState } from 'react'

import { BrowserRouter ,Routes} from 'react-router-dom';
import {AuthRoutes} from './routes/AuthRoutes'

 function App() {
  

  return (

    <>
    
    
     <BrowserRouter>
    
       <AuthRoutes></AuthRoutes>
       
       </BrowserRouter> 
    </>
  );
}

export default App;
