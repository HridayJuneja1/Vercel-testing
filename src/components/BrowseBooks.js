import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import Sorting from './Sorting';
import Search from './Search';

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [user] = useState(null);
  const userId = user?.id;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedBooks = data.map(book => ({
          id: book._id,
          title: book.title || '',
          author: book.author || '',
          image: book.image || ''
        }));
        setBooks(formattedBooks);
        setFilteredBooks(formattedBooks); // Initialize filteredBooks with all books
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Sorting books
  const sortBooks = (order) => {
    let sortedArray = [...filteredBooks]; // Sort based on filteredBooks

    if (order === 'asc') {
      sortedArray.sort((a, b) => a.title.localeCompare(b.title));
    } else if (order === 'desc') {
      sortedArray.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredBooks(sortedArray); // Update filteredBooks with the sorted array
  };

  // Filtering books
  const filterBooks = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredBooks(books); // Reset to all books if no search term
    } else {
      const search = searchTerm.trim().toLowerCase();
      const filteredArray = books.filter(book =>
        (book.title && book.title.toLowerCase().includes(search)) ||
        (book.author && book.author.toLowerCase().includes(search))
      );
      setFilteredBooks(filteredArray); // Update with filtered books
    }
  };

  const searchContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: '20px',
  };

  const sortingContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '20px',
    backgroundColor: '#000',
    paddingBottom: '10px',
  };

  const pageStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: '#000',
    padding: '20px',
    color: 'white',
  };

  const noBooksStyle = {
    textAlign: 'center',
    color: 'white',
    fontSize: '1.5rem',
  };

  return (
    <div>
      <div style={searchContainerStyle}>
        <Search filterBooks={filterBooks} />
      </div>
      <div style={sortingContainerStyle}>
        <Sorting sortBooks={sortBooks} />
      </div>
      <div style={pageStyle}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} userId={userId} />
          ))
        ) : (
          <div style={noBooksStyle}>No books found</div>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;
