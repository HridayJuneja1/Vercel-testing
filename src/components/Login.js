import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/';
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { email, password });

      if (response.data.authenticated) {
        login(response.data.user);
        alert(t('login_successful'));
      }
    } catch (error) {
      if (error.response) {
        alert(`${t('login_failed_error')}${error.response.data.error}`);
      } else {
        console.error('Login error:', error);
        alert(t('login_failed'));
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
