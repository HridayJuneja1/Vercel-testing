import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './ForgotPassword.css';

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(t('error_sending_email'));
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>{t('reset_password')}</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('enter_your_email')}
          required
        />
        <button type="submit">{t('send_reset_link')}</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
