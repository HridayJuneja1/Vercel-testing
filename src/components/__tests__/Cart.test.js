import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Cart from '../Cart';

// Mock axios requests
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'loading': 'Loading...',
        'your_cart': 'Your Cart',
        'cart_empty': 'Your cart is empty.',
        'delete': 'Delete',
        'proceed_to_checkout': 'Proceed to Checkout',
        'continue_shopping': 'Continue Shopping',
        'book_image': 'Book',
        'book_name': 'Book Name',
        'publication': 'Publication',
        'standard': 'Standard',
        'publication_year': 'Publication Year',
        'action': 'Action',
        'error_remove_cart_item': 'Error removing cart item:',
      };
      return translations[key];
    },
  }),
}));

describe('Cart Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ email: 'user@example.com' }));
  });

  // Helper function to add a delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  test('shows loading state initially', async () => {
    // Simulate a delay in the axios get request to allow loading state to be displayed
    axios.get.mockImplementation(() => delay(100).then(() => ({ data: { items: [] } })));

    await act(async () => {
      render(<Cart />);
    });

    // Expect "Loading..." to be shown before the data is resolved
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the loading to finish and the empty cart message to appear
    await waitFor(() => expect(screen.getByText(/Your cart is empty./i)).toBeInTheDocument());
  });

  test('shows empty cart message when no items', async () => {
    axios.get.mockResolvedValue({ data: { items: [] } });

    await act(async () => {
      render(<Cart />);
    });

    await waitFor(() => expect(screen.getByText(/Your cart is empty./i)).toBeInTheDocument());
  });

  test('renders cart items correctly', async () => {
    const items = [
      {
        isbn: '123',
        image: 'http://example.com/book1.jpg',
        title: 'Book 1',
        publication: 'Publisher 1',
        standard: 'Standard 1',
        publication_year: '2021',
      },
    ];
    axios.get.mockResolvedValue({ data: { items } });

    await act(async () => {
      render(<Cart />);
    });

    await waitFor(() => expect(screen.getByText('Book 1')).toBeInTheDocument());
    expect(screen.getByAltText('Book 1')).toHaveAttribute('src', 'http://example.com/book1.jpg');
  });

  test('removes an item from the cart', async () => {
    const items = [
      {
        isbn: '123',
        image: 'http://example.com/book1.jpg',
        title: 'Book 1',
        publication: 'Publisher 1',
        standard: 'Standard 1',
        publication_year: '2021',
      },
    ];
    axios.get.mockResolvedValue({ data: { items } });
    axios.post.mockResolvedValue({});

    await act(async () => {
      render(<Cart />);
    });

    await waitFor(() => expect(screen.getByText('Book 1')).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => expect(screen.getByText(/Your cart is empty./i)).toBeInTheDocument());
  });

  test('navigates to checkout page when checkout button is clicked', async () => {
    const items = [
      {
        isbn: '123',
        image: 'http://example.com/book1.jpg',
        title: 'Book 1',
        publication: 'Publisher 1',
        standard: 'Standard 1',
        publication_year: '2021',
      },
    ];
    axios.get.mockResolvedValue({ data: { items } });

    await act(async () => {
      render(<Cart />);
    });

    await waitFor(() => expect(screen.getByText('Book 1')).toBeInTheDocument());

    delete window.location;
    window.location = { href: '' };

    fireEvent.click(screen.getByText(/Proceed to Checkout/i));
    expect(window.location.href).toBe('/checkout');
  });
});
