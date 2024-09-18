import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';  // Importing jest-dom directly
import Search from '../Search';  // Adjust the path according to your file structure

describe('Search Component', () => {
  it('renders search input and button', () => {
    const { getByPlaceholderText, getByText } = render(<Search filterBooks={() => {}} />);

    // Check if the search input and button are rendered
    expect(getByPlaceholderText('Search by book name')).toBeInTheDocument();
    expect(getByText('Search')).toBeInTheDocument();
  });

  it('updates the search input value on change', () => {
    const { getByPlaceholderText } = render(<Search filterBooks={() => {}} />);

    const searchInput = getByPlaceholderText('Search by book name');
    
    // Simulate changing the search input
    fireEvent.change(searchInput, { target: { value: 'Test Book' } });

    expect(searchInput.value).toBe('Test Book');
  });

  it('calls filterBooks function when search button is clicked', () => {
    const mockFilterBooks = jest.fn();
    const { getByPlaceholderText, getByText } = render(<Search filterBooks={mockFilterBooks} />);

    const searchInput = getByPlaceholderText('Search by book name');
    const searchButton = getByText('Search');

    // Simulate entering text and clicking search
    fireEvent.change(searchInput, { target: { value: 'Test Book' } });
    fireEvent.click(searchButton);

    expect(mockFilterBooks).toHaveBeenCalledWith('Test Book');
  });

  it('calls filterBooks function when Enter key is pressed', () => {
    const mockFilterBooks = jest.fn();
    const { getByPlaceholderText } = render(<Search filterBooks={mockFilterBooks} />);

    const searchInput = getByPlaceholderText('Search by book name');

    // Simulate entering text and pressing Enter key
    fireEvent.change(searchInput, { target: { value: 'Test Book' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockFilterBooks).toHaveBeenCalledWith('Test Book');
  });
});
