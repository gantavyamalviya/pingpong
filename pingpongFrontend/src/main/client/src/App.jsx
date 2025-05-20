import pingPongLogo from './assets/pingpong-logo.png'
import './Main.css'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'

function App() {

  const navigate = useNavigate();

  return (
    <>
      <div>
      <img src={pingPongLogo} className="logo pingpong" alt="PingPong logo" />
      </div>
      <h1>Willkommen bie PingPong</h1>
      <p>Made with ❤️ by @gantavyamalviya</p>
      <Button onClick={() => navigate("/login")}>Login Now!</Button>
    </>
  )
}

export default App
