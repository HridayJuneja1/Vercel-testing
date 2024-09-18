import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ResetPassword.css';

function ResetPassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const { token: resetPasswordToken } = useParams();

  const passwordIsValid = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t("passwords_not_match_message"));
      return;
    }

    if (!passwordIsValid(password)) {
      setMessage(t("password_requirements_message")); // Ensure this key is translated in your i18n files
      return;
    }

    try {
      const response = await axios.post('/api/users/reset-password', { token: resetPasswordToken, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(t("password_reset_fail_message"));
    }
  };

  return (
    <div className="reset-password-wrapper">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2>{t('reset_password_title')}</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('new_password_placeholder')}
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('confirm_new_password_placeholder')}
          required
        />
        <button type="submit">{t('submit_button')}</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
