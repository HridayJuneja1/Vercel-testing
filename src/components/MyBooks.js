import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const styles = {
  headerStyle: {
    backgroundImage: 'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0")',
    height: '600px',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    textShadow: '2px 2px 4px #000000',
  },
  buttonStyle: {
    margin: '10px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sectionStyle: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '50%',
    backgroundImage: 'url("https://images.unsplash.com/photo-1581091012184-7e0cdfb6797")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
  },
  contentStyle: {
    width: '50%',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    color: 'black',
  },
  listStyle: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  listItemStyle: {
    marginBottom: '10px',
  },
  checkmarkStyle: {
    color: 'green',
    marginRight: '10px',
  },
  imageStyle: {
    width: '50%',
    height: 'auto',
  },
};

const MyBooks = () => {
  const { t } = useTranslation();

  return (
    <section style={styles.sectionStyle}>
      <img
        style={styles.imageStyle}
        src="https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Busy city street"
      />
      <div style={styles.contentStyle}>
        <h2>{t('feature_section_title')}</h2>
        <p>{t('feature_section_subtitle')}</p>
        <ul style={styles.listStyle}>
          <li style={styles.listItemStyle}><span style={styles.checkmarkStyle}>✔</span>{t('feature_list_wide_selection')}</li>
          <li style={styles.listItemStyle}><span style={styles.checkmarkStyle}>✔</span>{t('feature_list_detailed_descriptions')}</li>
          <li style={styles.listItemStyle}><span style={styles.checkmarkStyle}>✔</span>{t('feature_list_easy_navigation')}</li>
        </ul>
      </div>
    </section>
  );
};

export default MyBooks;