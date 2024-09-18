import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './PasswordChange.css';

function PasswordChange() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordIsValid = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert(t('passwords_dont_match_alert'));
      return;
    }

    if (!passwordIsValid(newPassword)) {
      alert(t('password_requirements_alert'));
      return;
    }

    try {
      const response = await axios.post('/api/users/change-password', { email, oldPassword, newPassword });
      if (response.data.success) {
        alert(t('password_changed_success_alert'));
      } else {
        alert(t('failed_change_password_alert'));
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert(t('technical_issues_alert'));
    }
  };

  return (
    <div className="container">
      <h2 className="title">{t('change_password_title')}</h2>
      <form onSubmit={handleSubmit} className="form">
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
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder={t('old_password_placeholder')}
          required
        />
        <input
          type="password"
          className="input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={t('new_password_placeholder')}
          required
        />
        <input
          type="password"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('confirm_new_password_placeholder')}
          required
        />
        <button type="submit" className="button">{t('submit_button')}</button>
      </form>
    </div>
  );
}

export default PasswordChange;
