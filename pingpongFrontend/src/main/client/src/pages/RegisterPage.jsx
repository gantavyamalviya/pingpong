import '../Main.css'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'

function RegisterPage() {
  
const navigate = useNavigate();

  return (
    <div>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required /> <br/>
        <input type="password" name="password" placeholder="Password" required /> <br/>
        <input type="email" name="email" placeholder="Email" required /> <br/>
        <button type="submit">Register</button>
      </form>
      <p>Already Registered?</p>
      <Button onClick={() => navigate("/login")}>Login Now!</Button>
    </div> 
  )
}

export default RegisterPage
