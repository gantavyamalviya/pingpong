import './Main.css'

function RegisterPage() {
  return (
    <div>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required /> <br/>
        <input type="password" name="password" placeholder="Password" required /> <br/>
        <input type="email" name="email" placeholder="Email" required /> <br/>
        <button type="submit">Register</button>
      </form>
      {/* <p>Already Registered? Login Now!</p> */}
    </div> 
  )
}

export default RegisterPage
