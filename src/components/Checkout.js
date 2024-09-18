import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Checkout = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(); 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            alert(data.message);
            navigate('/order-confirmed');
        } catch (error) {
            console.error('Error checking out:', error);
            alert('Error checking out. Please try again later.');
        }
    };

    return (
        <div style={{ fontFamily: '"Arial", sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '10px', marginBottom: '20px' }}>{t('fill_out_info')}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder={t('first_name')} name="firstName" value={formData.firstName} onChange={handleChange} required style={{ padding: '10px', fontSize: '16px', border: '1px solid #eaeaea' }} />
                <input type="text" placeholder={t('last_name')} name="lastName" value={formData.lastName} onChange={handleChange} required style={{ padding: '10px', fontSize: '16px', border: '1px solid #eaeaea' }} />
                <input type="email" placeholder={t('email_address')} name="email" value={formData.email} onChange={handleChange} required style={{ padding: '10px', fontSize: '16px', border: '1px solid #eaeaea' }} />
                <input type="tel" placeholder={t('phone_number')} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={{ padding: '10px', fontSize: '16px', border: '1px solid #eaeaea' }} />
                <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: 'black', color: '#fff', border: 'none', cursor: 'pointer' }}>{t('submit_order')}</button>
            </form>
        </div>
    );
}

export default Checkout;
