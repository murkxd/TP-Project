import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3030/api/auth/register', { username, email, password });
      window.location.href = '/';
    } catch (error) {
      console.error('Registration failed', error);
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
            <label>Uživatelské jméno:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mail:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Heslo:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="submit-button">Registrovat</button>
        </form>
      </div>
    </>
  );
}

export default Register;
