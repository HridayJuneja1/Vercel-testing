import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Cart from '../Cart';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
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
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the loading to finish and the empty cart message to appear
    await waitFor(() => expect(screen.getByText(/your cart is empty./i)).toBeInTheDocument());
  });

  test('shows empty cart message when no items', async () => {
    axios.get.mockResolvedValue({ data: { items: [] } });

    await act(async () => {
      render(<Cart />);
    });

    await waitFor(() => expect(screen.getByText(/your cart is empty./i)).toBeInTheDocument());
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
    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => expect(screen.getByText(/your cart is empty./i)).toBeInTheDocument());
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

    fireEvent.click(screen.getByText(/proceed to checkout/i));
    expect(window.location.href).toBe('/checkout');
  });
});
