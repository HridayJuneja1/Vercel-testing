import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './Cart.css';

const Cart = () => {
  const { t } = useTranslation();  // Using the useTranslation hook
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
          const response = await axios.get(`/api/cart/${encodeURIComponent(user.email)}`);
          setCartItems(response.data.items);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert(t('cart_empty')); // Using translation for empty cart alert
      return;
    } else {
      window.location.href = "/checkout";
    }
  };

  const handleRemoveFromCart = async (isbn) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      try {
        await axios.post(`/api/cart/remove`, { userEmail: user.email, isbn });
        const updatedCartItems = cartItems.filter((item) => item.isbn !== isbn);
        setCartItems(updatedCartItems);
      } catch (error) {
        console.error(t('error_remove_cart_item'), error); // Translation for error message
      }
    }
  };

  if (isLoading) return <div>{t('loading')}</div>; // Translation for loading
  return (
    <div className="cart">
      <h2>{t('your_cart')}</h2>
      {cartItems.length === 0 ? (
        <p>{t('cart_empty')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t('book_image')}</th>
              <th>{t('book_name')}</th>
              <th>{t('publication')}</th>
              <th>{t('standard')}</th>
              <th>{t('publication_year')}</th>
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <img src={item.image} alt={`Book ${index + 1}`} className="cart-book-image" />
                </td>
                <td>{item.title}</td>
                <td>{item.publication}</td>
                <td>{item.standard}</td>
                <td>{item.publication_year}</td>
                <td>
                  <button onClick={() => handleRemoveFromCart(item.isbn)} className="remove-from-cart-button">
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="cart-actions">
        <button className="continue-shopping-button" onClick={() => window.location.href = "/browse-books"}>
          {t('continue_shopping')}
        </button>
        <button 
          className="proceed-to-checkout-button" 
          onClick={handleProceedToCheckout}
          disabled={cartItems.length === 0}
        >
          {t('proceed_to_checkout')}
        </button>
      </div>
    </div>
  );  
};

export default Cart;
