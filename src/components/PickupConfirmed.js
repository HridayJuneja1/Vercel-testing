import React from 'react';
import { useTranslation } from 'react-i18next';

const PickupConfirmed = () => {
  const { t } = useTranslation();

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f3f3f3',
  };

  const messageStyle = {
    marginTop: '20px',
    fontWeight: 'bold',
    fontSize: '24px',
  };

  return (
    <div style={containerStyle}>
      <img src="https://cdn.pixabay.com/photo/2016/03/31/14/37/check-mark-1292787_1280.png" alt={t('order_confirmed')} style={{ maxWidth: '100px' }} />
      <div style={messageStyle}>{t('pickup_confirmed')}</div>
        <div style={{ marginTop: '20px' }}>{t('thank_you_for_shopping')}</div>
      <div style={{ marginTop: '20px' }}>{t('check_pickup_details')}</div>
    </div>
  );
};

export default PickupConfirmed;