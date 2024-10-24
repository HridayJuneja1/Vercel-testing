import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make the login request
      const response = await axios.post('/api/users/login', { email, password });

      // Check if authentication was successful
      if (response.data.authenticated) {
        // Store the full user data (including _id) in localStorage
        localStorage.setItem('user', JSON.stringify({
          _id: response.data._id, // Store the user ID properly
          name: response.data.user.name,
          email: response.data.user.email,
        }));

        // Redirect to dashboard with user ID
        window.location.href = `/`;
        alert(t('login_successful'));
      } else {
        alert(t('login_failed')); // In case authentication fails
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error message from the backend
        alert(`${t('login_failed_error')}${error.response.data.error}`);
      } else {
        console.error('Login error:', error); // Log any other error
        alert(t('login_failed')); // General login failure message
      }
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="form">
        <h2 className="title">{t('login_title')}</h2>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email_placeholder')}
          required
        />
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('password_placeholder')}
          required
        />
        <button type="submit" className="button">{t('login_button')}</button>
        <div className="forgot-password">
          <Link to="/forgot-password">{t('forgot_password_link')}</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
