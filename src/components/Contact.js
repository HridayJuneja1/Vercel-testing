import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Failed to send the message. Please try again later.');
    }
  };

  return (
    <div className="contact-container">
      <h2>{t('contact_us')}</h2>
      <p>{t('contact_description')}</p>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">{t('name_label')}</label>
        <input type="text" id="name" name="name" required onChange={handleChange} value={formData.name} />

        <label htmlFor="email">{t('email_label')}</label>
        <input type="email" id="email" name="email" required onChange={handleChange} value={formData.email} />

        <label htmlFor="message">{t('message_label')}</label>
        <textarea id="message" name="message" rows="6" required onChange={handleChange} value={formData.message}></textarea>

        <button type="submit">{t('send_button')}</button>
      </form>
    </div>
  );
};

export default Contact;