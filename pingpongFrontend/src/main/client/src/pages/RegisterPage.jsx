import '../Main.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@mui/material';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: username, password, email })
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        navigate('/login');
      } else {
        const errorMsg = await response.text();
        setError(errorMsg);
      }
    } catch (err) {
      setError('Network or server error');
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" required value={username} onChange={(e) => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Already Registered?</p>
      <Button onClick={() => navigate("/login")}>Login Now!</Button>
    </div>
  );
}

export default RegisterPage;
