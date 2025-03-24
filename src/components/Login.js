import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css'; // Import the CSS file

function Login() {
  const [username, setUsername] = useState('');
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
    <div className="auth-container">
      <button 
        type="button" 
        onClick={() => window.location.href = '/'} 
        className="back-button"
      >
        Back
      </button>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Username:</label> {/* Changed from Email to Username */}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <div className="auth-footer">
        <span>Don't have an account? </span>
        <button 
          type="button" 
          onClick={() => window.location.href = '/register'} 
          className="register-button"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
