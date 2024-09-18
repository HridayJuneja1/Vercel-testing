import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = t('faq_questions', { returnObjects: true });

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };


  const faqContainerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const faqHeaderStyle = {
    textAlign: 'center',
    marginBottom: '20px',
  };

  const faqStyle = {
    marginBottom: '10px',
    padding: '15px',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
  };

  const faqQuestionStyle = {
    fontWeight: '500',
    fontSize: '18px',
    margin: '0',
    color: 'black'
  };

  const faqAnswerStyle = index => ({
    display: activeIndex === index ? 'block' : 'none',
    padding: '10px 20px',
    background: '#fff',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginTop: '10px',
  });

  return (
    <div style={faqContainerStyle}>
      <h2 style={faqHeaderStyle}>{t('faq_title')}</h2>
      {faqs.map((faq, index) => (
        <div key={index} style={faqStyle} onClick={() => toggleFAQ(index)}>
          <h3 style={faqQuestionStyle}>{faq.question}</h3>
          <p style={faqAnswerStyle(index)}>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
