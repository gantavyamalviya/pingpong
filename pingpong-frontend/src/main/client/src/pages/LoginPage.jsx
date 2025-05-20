import './Main.css'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'

function LoginPage() {

  const navigate = useNavigate();

  return (
    <div>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required /> <br/>
        <input type="password" name="password" placeholder="Password" required /> <br/>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account?</p>
      <Button onClick={() => navigate("/register")}>Register Now!</Button>
    </div> 
  )
}

export default LoginPage
