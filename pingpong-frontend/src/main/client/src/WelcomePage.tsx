import pingPongLogo from './assets/pingpong-logo.png'
import './WelcomePage.css'

function WelcomePage() {
  return (
    <>
      <div>
      <img src={pingPongLogo} className="logo pingpong" alt="PingPong logo" />
      </div>
      <h1>Willkommen bie PingPong</h1>
      <p>Made with ❤️ by @ganatvyamalviya</p>
    </>
  )
}

export default WelcomePage
