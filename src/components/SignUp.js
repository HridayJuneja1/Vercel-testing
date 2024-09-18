import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SignUp.css';

function SignUp() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const passwordIsValid = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t('passwords_not_match_alert'));
      return;
    }

    if (!passwordIsValid(password)) {
      alert(t('password_requirements_alert'));
      return;
    }

    try {
      await axios.post('/api/users/register', { name, email, password });
      navigate('/signup-confirmation');
    } catch (error) {
      let errorMessage = t('failed_register_alert');
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="container">
      <h2 className="title">{t('sign_up_title')}</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('name_placeholder')}
          required
        />
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
        <input 
          type="password" 
          className="input" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder={t('confirm_password_placeholder')} 
          required 
        />
        <button type="submit" className="button">{t('sign_up_button')}</button>
      </form>
    </div>
  );
}

export default SignUp;
