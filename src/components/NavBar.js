import React from 'react';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const navBarStyle = {
    backgroundColor: 'black',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    alignItems: 'center',
  };

  const navItemStyle = {
    textDecoration: 'none',
    color: 'white',
    margin: '0 10px',
    backgroundColor: 'black',
    cursor: 'pointer',
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    window.location.href = '/login';
  };

  return (
    <nav style={navBarStyle}>
      <a href="/" style={{ ...navItemStyle, fontWeight: 'bold', fontSize: '24px' }}>
        {t('website_title')}
      </a>
      <div>
        <a href="/" style={navItemStyle}>{t('home')}</a>
        <a href="/MyBooks" style={navItemStyle}>{t('catalog')}</a>
        <a href="/cart" style={navItemStyle}>{t('your_cart')}</a>
        <a href="/change-password" style={navItemStyle}>{t('change_password_title')}</a>
        {user ? (
          <>
            <span style={{ ...navItemStyle }}>{user.name}</span>
            <button onClick={handleLogout} style={{ ...navItemStyle, background: 'none', border: 'none' }}>
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <a href="/login" style={navItemStyle}>{t('log_in')}</a>
            <a href="/signup" style={navItemStyle}>{t('sign_up')}</a>
          </>
        )}
        <button onClick={() => changeLanguage('en')} style={navItemStyle}>EN</button>
        <button onClick={() => changeLanguage('sa')} style={navItemStyle}>SA</button>
      </div>
    </nav>
  );
};

export default NavBar;
