import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css'; // Import the CSS file

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3030/api/auth/login', { username, password }); // Updated base URL
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error); // Zobrazí chybu ze serveru
      } else {
        console.error('Login failed', error);
        alert('Login failed. Please try again.');
      }
    }
  };

  return (
    <>
      <header className="global-header">
        <h1>Smart Bazar</h1>
      </header>
  
      <div className="auth-container">
        <button 
          type="button" 
          onClick={() => window.location.href = '/'} 
          className="back-button"
        >
          ⬅ Zpět na hlavní stránku
        </button>
  
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="submit-button">Login</button>
  
          <div className="auth-footer-inline">
            <span>Nemáš účet?</span>
            <button
              type="button"
              onClick={() => window.location.href = '/register'}
              className="register-button small"
            >
              Registrovat
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
