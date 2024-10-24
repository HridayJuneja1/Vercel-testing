import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const styles = {
  bannerStyle: {
    backgroundImage: `url('https://images.unsplash.com/photo-1657302155425-611b7aba5b33?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8c2Fuc2tyaXR8fHx8fHwxNzExMzkwOTQ4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=720')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    padding: '20px',
    boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)',
  },
  buttonStyle: {
    margin: '10px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: 'black',
    color: 'white',
  },
  sectionStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    color: 'white',
    padding: '40px',
  },
  imageContainerStyle: {
    width: '50%',
    backgroundImage: `url('https://images.unsplash.com/photo-1603058817990-2b9a9abbce86?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8bGlicmFyeXx8fHx8fDE3MTEzOTA5NDg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=720')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
  },
  textContainerStyle: {
    width: '50%',
    padding: '50px',
  },
  listStyle: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  listItemStyle: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  checkmarkStyle: {
    color: 'blue',
    marginRight: '10px',
  },
  faqStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '40px',
    backgroundColor: 'black',
    color: 'white',
  },
  faqColumnStyle: {
    width: '45%',
    margin: '0 2.5%',
  },
  faqHeaderStyle: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  questionStyle: {
    fontWeight: 'bold',
    marginTop: '20px',
  }
};

const Home = () => {
  const { t } = useTranslation();

  return (
    <div style={styles.sectionStyle}>
      <div style={styles.imageContainerStyle}></div>
      <div style={styles.textContainerStyle}>
        <h2>{t('home_feature_title')}</h2>
        <p>{t('home_feature_description')}</p>
        <ul style={styles.listStyle}>
          <li style={styles.listItemStyle}><span style={styles.checkmarkStyle}>✔</span>{t('feature_user_registration')}</li>
          <li style={styles.listItemStyle}><span style={styles.checkmarkStyle}>✔</span>{t('feature_book_transactions')}</li>
          <li style={styles.listItemStyle}><span style={styles.checkmarkStyle}>✔</span>{t('feature_advanced_features')}</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;