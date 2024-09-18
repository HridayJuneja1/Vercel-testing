import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {

  const navigate = useNavigate();

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    margin: '10px',
    textAlign: 'center',
    backgroundColor: '#444',
    color: 'white',
    width: '350px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const imageStyle = {
    width: '330px',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '5px',
  };

  const titleStyle = {
    fontSize: '1rem',
    margin: '10px 0',
    color: 'white',
    cursor: 'pointer', // Add cursor to indicate clickability
  };

  const authorStyle = {
    fontSize: '0.9rem',
    color: '#aaa',
  };

  return (
    <div style={cardStyle}>
      <img 
        src={book.image} 
        alt={book.title} 
        style={imageStyle} 
        onClick={() => navigate(`/book/${book.id}`)} 
      />
      <div style={titleStyle} onClick={() => navigate(`/book/${book.id}`)}>
        {book.title}
      </div>
      <div style={authorStyle}>{book.author}</div>
    </div>
  );
}

export default BookCard;