import { render, fireEvent } from '@testing-library/react';
import Sorting from '../Sorting';

// Test suite for the Sorting component
describe('Sorting', () => {

  // Test case to check if the Sorting component renders correctly
  it('should render correctly', () => {
    // Render the Sorting component
    const { queryByLabelText } = render(<Sorting />);

    // Check if the label with text 'Sort by:' exists in the document
    const label = queryByLabelText('Sort by:');
    
    // Assert that the label is present (truthy means it exists)
    expect(label).toBeTruthy();
  });

  // Test case to ensure the sortBooks function is called when an option is selected
  it('should call sortBooks function when an option is selected', () => {
    // Mock function to test if it's called correctly
    const sortBooks = jest.fn();

    // Render the Sorting component with the mocked sortBooks function
    const { getByLabelText } = render(<Sorting sortBooks={sortBooks} />);

    // Get the select element by its label 'Sort by:'
    const select = getByLabelText('Sort by:');

    // Simulate changing the selection to 'asc'
    fireEvent.change(select, { target: { value: 'asc' } });

    // Assert that the mock sortBooks function was called with the correct argument ('asc')
    expect(sortBooks).toHaveBeenCalledWith('asc');
  });
});
