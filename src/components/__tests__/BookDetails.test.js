import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookDetails from '../BookDetails';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('BookDetails', () => {
  let consoleErrorMock;

  beforeEach(() => {
    useParams.mockReturnValue({ bookId: '123' });
    localStorage.clear();
    // Mock console.error
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorMock.mockRestore();
  });

  it('displays loading state initially', async () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Simulate loading state
    render(<BookDetails />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads and displays book details', async () => {
    axios.get.mockResolvedValue({
      data: {
        title: 'Test Book',
        isbn: '123456789',
        image: 'test-image-url',
        publication: 'Test Publication',
        publication_year: '2020',
        dimensions: '8.5 x 11 in',
        description: 'Test Description',
        standard: 'Test Standard',
      },
    });

    render(<BookDetails />);

    await waitFor(() => screen.getByText('Test Book'));
  });

  it('adds book to cart for a logged-in user', async () => {
    localStorage.setItem('user', JSON.stringify({ email: 'user@test.com' }));
    axios.get.mockResolvedValueOnce({
      data: {
        isbn: '123456789',
        title: 'Test Book',
      },
    });
    axios.post.mockResolvedValue({ status: 200 });

    render(<BookDetails />);

    await waitFor(() => screen.getByText('add_to_cart'));
    fireEvent.click(screen.getByText('add_to_cart'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it('alerts when adding to cart without being logged in', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    axios.get.mockResolvedValueOnce({
      data: {
        isbn: '123456789',
        title: 'Test Book',
      },
    });

    render(<BookDetails />);

    await waitFor(() => screen.getByText('add_to_cart'));
    fireEvent.click(screen.getByText('add_to_cart'));

    expect(alertMock).toHaveBeenCalledWith('login_to_add_to_cart');
    alertMock.mockRestore(); // Restore the original alert implementation
  });

  it('handles error when adding book to cart fails', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    localStorage.setItem('user', JSON.stringify({ email: 'user@test.com' }));
    axios.get.mockResolvedValueOnce({
      data: {
        isbn: '123456789',
        title: 'Test Book',
      },
    });
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<BookDetails />);

    await waitFor(() => screen.getByText('add_to_cart'));
    fireEvent.click(screen.getByText('add_to_cart'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith('error_adding_to_cart');
    });

    alertMock.mockRestore();
  });

  it('handles error when checking cart fails', async () => {
    localStorage.setItem('user', JSON.stringify({ email: 'user@test.com' }));
    axios.get.mockResolvedValueOnce({
      data: {
        isbn: '123456789',
        title: 'Test Book',
      },
    });

    // Simulate an error when checking the cart
    axios.get.mockResolvedValueOnce({
      data: {
        items: undefined, // Simulate a failure with undefined items
      },
    });

    axios.get.mockRejectedValueOnce(new Error('Network Error')); // Simulate cart error

    render(<BookDetails />);

    await waitFor(() => screen.getByText('Test Book'));
  });
});
