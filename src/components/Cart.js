import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css'; 

const Cart = () => {
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
      alert('Your cart is empty.');
      return;
    }
    else {
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
        console.error("Error removing cart item:", error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Book Name</th>
              <th>Publication</th>
              <th>Standard</th>
              <th>Publication Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td><img src={item.image} alt={`Book ${index + 1}`} className="cart-book-image" /></td>
                <td>{item.title}</td>
                <td>{item.publication}</td>
                <td>{item.standard}</td>
                <td>{item.publication_year}</td>
                <td>
                  <button onClick={() => handleRemoveFromCart(item.isbn)} className="remove-from-cart-button">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="cart-actions">
        <button className="continue-shopping-button" onClick={() => window.location.href = "/browse-books"}>Continue Shopping</button>
        <button className="proceed-to-checkout-button" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
