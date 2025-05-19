import './Main.css'

function LoginPage() {
  return (
    <div>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required /> <br/>
        <input type="password" name="password" placeholder="Password" required /> <br/>
        <button type="submit">Login</button>
      </form>
      {/* <p>Not registered yet? Register Now!</p> */}
    </div> 
  )
}

export default LoginPage
