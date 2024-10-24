import React from 'react';
import { useTranslation } from 'react-i18next';

const ReadyForPickup = ({ readyForPickup }) => (
    <div style={styles.section}>
      <h2>Books Ready for Pickup</h2>
      {readyForPickup.length > 0 ? (
        <div style={styles.bookList}>
          {readyForPickup.map((book, index) => (
            <div key={index} style={styles.bookCard}>
              {book.items.map((item, i) => (
                <div key={i} style={styles.bookInfo}>
                  {/* Display the book image */}
                  <img src={item.image} alt={item.title} style={styles.bookImage} />
  
                  {/* Book details */}
                  <div style={styles.bookDetails}>
                    <h3 style={styles.bookTitle}>{item.title}</h3>
                    <p style={styles.bookAuthor}>by {item.author}</p>
                    <p style={styles.pickupInfo}>
                      <strong>Pickup at:</strong> {book.pickupLocation}
                    </p>
                    <p style={styles.pickupInfo}>
                      <strong>Pickup Date:</strong> {new Date(book.pickupDate).toLocaleDateString()}
                    </p>
                    <p style={styles.pickupInfo}>
                      <strong>Pickup Time:</strong> {book.pickupTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No books ready for pickup.</p>
      )}
    </div>
  );
  
  const styles = {
    section: {
      marginBottom: '30px',
    },
    bookList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
    },
    bookCard: {
      display: 'flex',
      flexDirection: 'column',
      width: '250px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    bookInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    bookImage: {
      width: '150px',
      height: '200px',
      objectFit: 'cover',
      marginBottom: '10px',
    },
    bookDetails: {
      textAlign: 'center',
    },
    bookTitle: {
      fontSize: '18px',
      margin: '10px 0',
    },
    bookAuthor: {
      fontSize: '16px',
      margin: '5px 0',
      color: '#555',
    },
    pickupInfo: {
      fontSize: '14px',
      margin: '5px 0',
    },
  };
  
  export default ReadyForPickup;
  