import { useState } from 'react'
import {Signup} from './pages/Signup'

 function App() {
  const [count, setCount] = useState(0)

  return (
    <>
         <Signup/> 
    </>
  );
}

export default App;
