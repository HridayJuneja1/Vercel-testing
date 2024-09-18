import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: 'black',
    color: 'white',
  };

  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const rightColumnStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '30%',
  };

  const columnTitleStyle = {
    fontWeight: 'bold',
    marginBottom: '15px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    marginBottom: '10px',
  };

  const copyrightStyle = {
    marginTop: '20px',
  };

 return (
    <footer style={footerStyle}>
      <div style={leftColumnStyle}>
        <h3 style={columnTitleStyle}>{t('footer_title')}</h3>
        <br />
        <p>{t('rights_reserved')}</p>
        <p>
          {t('footer_description')}
        </p>
      </div>
      <div style={rightColumnStyle}>
        <div>
          <h4 style={columnTitleStyle}>{t('quick_links')}</h4>
          <br />
          <a href="/" style={linkStyle}>{t('home')}</a>
          <br />
          <br />
          <a href="/MyBooks" style={linkStyle}>{t('catalog')}</a>
          <br />
          <br />
          <a href="/cart" style={linkStyle}>{t('your_cart')}</a>
        </div>
        <div>
          <h4 style={columnTitleStyle}>{t('connect')}</h4>
          <a href="https://facebook.com" style={linkStyle}>{t('facebook')}</a>
          <br />
          <br />
          <a href="https://instagram.com" style={linkStyle}>{t('instagram')}</a>
          <br />
          <br />
          <a href="https://twitter.com" style={linkStyle}>{t('twitter')}</a>
        </div>
      </div>
      <p style={copyrightStyle}>{t('copyright')}</p>
    </footer>
  );
};

export default Footer;
