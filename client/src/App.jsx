import { useState } from 'react'
import {Signup} from './pages/Signup'
import {UserLogin} from './pages/UserLogin'

 function App() {
  const [count, setCount] = useState(0)

  return (
    <>
         <UserLogin/>
    </>
  );
}

export default App;
