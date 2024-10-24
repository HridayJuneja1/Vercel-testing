import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
  const [dropdownOpen, setDropdownOpen] = useState(false); // Control dropdown visibility

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language); // Store language preference
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

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: 'white',
    color: 'black',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    zIndex: '1',
    listStyle: 'none',
    padding: '10px',
    display: dropdownOpen ? 'block' : 'none', // Show or hide dropdown
  };

  const dropdownItemStyle = {
    padding: '10px',
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    window.location.href = '/login'; // Redirect to login page
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

        {user ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* User name and dropdown arrow */}
            <span
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ ...navItemStyle, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            >
              {user.name} <span style={{ marginLeft: '5px', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>▼</span>
            </span>

            {/* Dropdown menu */}
            <ul style={dropdownStyle}>
              <li>
                <a href={`/dashboard/${user._id}`} style={dropdownItemStyle}>
                  {t('personalized_dashboard')}
                </a>
              </li>
              <br />
              <li>
                <a href="/change-password" style={dropdownItemStyle}>
                  {t('change_password_title')}
                </a>
              </li>
              <br />
              <li>
                <a onClick={handleLogout} style={dropdownItemStyle}>
                  {t('logout')}
                </a>
              </li>
            </ul>
          </div>
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
