import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './BookDetail.css';

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [isLoggedIn] = useState(!!localStorage.getItem('user'));
  const [isBookInCart, setIsBookInCart] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/book/${bookId}`);
        setBook(response.data);
        setIsLoading(false);

        if (isLoggedIn) {
          const user = JSON.parse(localStorage.getItem('user'));
          const cartResponse = await axios.get(`/api/cart/${encodeURIComponent(user.email)}`);
          const isBookAdded = cartResponse.data.items.some(item => item.isbn === response.data.isbn);
          setIsBookInCart(isBookAdded);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, isLoggedIn]);

  const addToCart = async () => {
    if (!isLoggedIn) {
      alert(t('login_to_add_to_cart'));
      return;
    }

    if (isBookInCart) {
      alert(t('book_already_in_cart'));
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user.email;

    try {
      const response = await axios.post(`/api/cart/add`, {
        title: book?.title,
        isbn: book.isbn,
        image: book?.image,
        publication: book?.publication,
        standard: book?.standard,
        description: book?.description,
        publication_year: book?.publication_year,
        dimensions: book?.dimensions,
        userEmail,
      });
      if (response.status === 200) {
        alert(t('book_added_to_cart'));
        setIsBookInCart(true);
      } else {
        alert(t('error_adding_to_cart'));
      }
    } catch (error) {
      console.error("Error adding book to cart:", error);
      alert(t('error_adding_to_cart'));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>{t('book_not_found')}</div>;
  }

  return (
    <div className="book-detail">
      <div className="header">
        <h1>{t('book_preview')}</h1>
      </div>
      <div className="book-content">
        <div className="book-image">
          <img src={book?.image} alt={t('title_not_available')} />
        </div>
        <div className="book-info">
          <div className="book-text">
            <h1>{book?.title || t('title_not_available')}</h1>
            <p><strong>{t('publication')}:</strong> {book.publication}</p>
            <p><strong>{t('isbn')}:</strong> {book.isbn}</p>
            <p><strong>{t('publication_year')}:</strong> {book.publication_year || t('na')}</p>
            <p><strong>{t('dimensions')}:</strong> {book.dimensions || t('na')}</p>
            <p><strong>{t('description')}:</strong> {book.description}</p>
            <p><strong>{t('standard')}:</strong> {book.standard}</p>
          </div>
          <button className="add-to-cart-button" onClick={addToCart}>
            {t('add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
