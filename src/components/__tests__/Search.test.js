import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../Search';

// Test suite for the Search component
describe('Search Component', () => {

  // Test case to check if the search input and search button are rendered
  it('renders search input and button', () => {
    // Render the Search component with a dummy filterBooks function
    const { getByPlaceholderText, getByText } = render(<Search filterBooks={() => {}} />);

    // Check if the input field with the placeholder 'Search by book name or ISBN' is present
    expect(getByPlaceholderText('Search by book name or ISBN')).toBeInTheDocument();
    
    // Check if the 'Search' button is present
    expect(getByText('Search')).toBeInTheDocument();
  });

  // Test case to verify that the input field updates its value when the user types
  it('updates the search input value on change', () => {
    // Render the Search component
    const { getByPlaceholderText } = render(<Search filterBooks={() => {}} />);

    // Select the search input field
    const searchInput = getByPlaceholderText('Search by book name or ISBN');
    
    // Simulate typing into the search input
    fireEvent.change(searchInput, { target: { value: '978-3-16-148410-0' } });

    // Assert that the input field's value has been updated to '978-3-16-148410-0'
    expect(searchInput.value).toBe('978-3-16-148410-0');
  });

  // Test case to ensure that the filterBooks function is called when the search button is clicked
  it('calls filterBooks function when search button is clicked', () => {
    // Mock function to test whether it's called
    const mockFilterBooks = jest.fn();

    // Render the Search component with the mocked filterBooks function
    const { getByPlaceholderText, getByText } = render(<Search filterBooks={mockFilterBooks} />);

    // Select the search input and search button
    const searchInput = getByPlaceholderText('Search by book name or ISBN');
    const searchButton = getByText('Search');

    // Simulate typing into the search input
    fireEvent.change(searchInput, { target: { value: '978-3-16-148410-0' } });

    // Simulate clicking the search button
    fireEvent.click(searchButton);

    // Assert that the mockFilterBooks function was called with the correct search term (with dashes)
    expect(mockFilterBooks).toHaveBeenCalledWith('978-3-16-148410-0');
  });

  // Test case to ensure that the filterBooks function is called when the Enter key is pressed in the search input
  it('calls filterBooks function when Enter key is pressed', () => {
    // Mock function to test whether it's called
    const mockFilterBooks = jest.fn();

    // Render the Search component with the mocked filterBooks function
    const { getByPlaceholderText } = render(<Search filterBooks={mockFilterBooks} />);

    // Select the search input field
    const searchInput = getByPlaceholderText('Search by book name or ISBN');

    // Simulate typing into the search input
    fireEvent.change(searchInput, { target: { value: '9783161484100' } });

    // Simulate pressing the 'Enter' key
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Assert that the mockFilterBooks function was called with the correct search term (without dashes)
    expect(mockFilterBooks).toHaveBeenCalledWith('9783161484100');
  });
});
