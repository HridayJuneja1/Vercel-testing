import React from 'react';
import { useTranslation } from 'react-i18next';
import './VerificationSuccess.css';

function VerificationSuccess() {
  const { t } = useTranslation();

  return (
    <div className="verification-success-container">
      <h2 className="verification-success-title">{t('account_verified')}</h2>
      <p className="verification-success-text">{t('account_verified_message')}</p>
    </div>
  );
}

export default VerificationSuccess;
