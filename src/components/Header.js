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

const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <header style={styles.headerStyle}>
            <h1>{t('header_title')}</h1>
            <p>{t('header_subtitle')}</p>
            <div>
                <button style={{ ...styles.buttonStyle, backgroundColor: 'black', color: 'white' }} onClick={() => navigate('/browse-books')}>
                    {t('browse_books_button')}
                </button>
                <button style={{ ...styles.buttonStyle, backgroundColor: 'white', color: 'black' }} onClick={() => navigate('/contact')}>
                    {t('contact_us_button')}
                </button>
            </div>
        </header>
    );
};

export default Header;