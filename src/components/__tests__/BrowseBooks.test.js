import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BrowseBooks from '../BrowseBooks';

jest.mock('../BookCard', () => ({ book, userId }) => <div data-testid={`book-${book.id}`}>{book.title}</div>);

describe('BrowseBooks', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { _id: '1', title: 'Book One', image: 'url-to-image-1' },
          { _id: '2', title: 'Book Two', image: 'url-to-image-2' },
        ]),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('fetches books and displays them on successful fetch', async () => {
    const { findByTestId } = render(<BrowseBooks />);

    const book1 = await findByTestId('book-1');
    const book2 = await findByTestId('book-2');

    expect(book1).toHaveTextContent('Book One');
    expect(book2).toHaveTextContent('Book Two');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/books');
  });
});
