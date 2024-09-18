import { render, fireEvent } from '@testing-library/react';
import Sorting from '../Sorting';

describe('Sorting', () => {
  it('should render correctly', () => {
    const { queryByLabelText } = render(<Sorting />);
    const label = queryByLabelText('Sort by:');
    expect(label).toBeTruthy();
  });

  it('should call sortBooks function when an option is selected', () => {
    const sortBooks = jest.fn();
    const { getByLabelText } = render(<Sorting sortBooks={sortBooks} />);
    const select = getByLabelText('Sort by:');
    fireEvent.change(select, { target: { value: 'asc' } });
    expect(sortBooks).toHaveBeenCalledWith('asc');
  });
});