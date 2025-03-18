import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { username, password }); // Updated endpoint
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div style={{ paddingTop: '7rem' }}>
      <button 
        type="button" 
        onClick={() => window.location.href = '/'} 
        style={{ 
          position: 'absolute', 
          top: '1rem', 
          left: '1rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label> {/* Changed from Email to Username */}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
