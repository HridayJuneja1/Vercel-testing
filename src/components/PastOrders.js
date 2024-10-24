import React from 'react';
import { Link } from 'react-router-dom';

const PastOrders = ({ pastOrders }) => (
    <div style={styles.section}>
      <h2>Past Orders</h2>
      {pastOrders.length > 0 ? (
        <ul>
          {pastOrders.map((order, index) => (
            <li key={index} style={styles.listItem}>
              {order.title} by {order.author} (Ordered on {new Date(order.orderDate).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No past orders found.</p>
      )}
    </div>
  );

const styles = {
    section: {
      marginBottom: '30px',
    },
    listItem: {
      marginBottom: '10px',
    },
  };

export default PastOrders;