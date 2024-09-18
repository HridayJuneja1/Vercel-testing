import React from 'react';
import { useTranslation } from 'react-i18next';
import './SignUpConfirmation.css';

function SignUpConfirmation() {
  const { t } = useTranslation();

  return (
    <div className="sign-up-confirmation-container">
      <h2 className="sign-up-confirmation-title">{t('registration_successful')}</h2>
      <p className="sign-up-confirmation-text">{t('check_email_verification')}</p>
    </div>
  );
}

export default SignUpConfirmation;
