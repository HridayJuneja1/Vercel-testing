import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import Sorting from './Sorting';
import Search from './Search';

// The main component that handles displaying books, sorting, and searching.
const BrowseBooks = () => {
  // `books` holds all the fetched books, `filteredBooks` holds the displayed (searched/sorted) books.
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [user] = useState(null); // Placeholder for user authentication; currently set to `null`.
  const userId = user?.id; // Optional chaining to get the userId if user exists.

  // useEffect hook to fetch the books when the component mounts.
  useEffect(() => {
    // Asynchronous function to fetch book data from the API.
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books'); // Fetch the books from the server.
        
        // Check if the response is not OK (status other than 200-299).
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response data as JSON.
        const data = await response.json();

        // Format the book data (assumes each book has _id, title, author, isbn, and image fields).
        const formattedBooks = data.map(book => ({
          id: book._id,
          title: book.title || '',  // Ensure title is present, fallback to empty string if undefined.
          author: book.author || '', // Ensure author is present, fallback to empty string if undefined.
          isbn: book.isbn || '',  // Ensure ISBN is present, fallback to empty string if undefined.
          image: book.image || ''  // Ensure image is present, fallback to empty string if undefined.
        }));

        // Set the `books` and `filteredBooks` states to the fetched and formatted books.
        setBooks(formattedBooks);
        setFilteredBooks(formattedBooks); // Initially, display all books.
      } catch (error) {
        console.error("Error fetching books:", error); // Log any errors during the fetching process.
      }
    };

    fetchBooks(); // Invoke the fetchBooks function.
  }, []); // Empty dependency array ensures this effect only runs once on component mount.

  // Function to handle sorting of the books.
  const sortBooks = (order) => {
    // Create a copy of the filteredBooks to avoid mutating the state directly.
    let sortedArray = [...filteredBooks]; 

    // Sort based on the order selected (ascending or descending by title).
    if (order === 'asc') {
      sortedArray.sort((a, b) => a.title.localeCompare(b.title)); // Sort A to Z.
    } else if (order === 'desc') {
      sortedArray.sort((a, b) => b.title.localeCompare(a.title)); // Sort Z to A.
    }

    // Update the filteredBooks state with the sorted array.
    setFilteredBooks(sortedArray);
  };

  // Function to filter books based on the search term (title, author, or ISBN).
  const filterBooks = (searchTerm) => {
    if (!searchTerm.trim()) {
      // If search term is empty, reset the filteredBooks to show all books.
      setFilteredBooks(books);
    } else {
      // Prepare the search term by trimming whitespace and removing dashes from ISBN.
      const search = searchTerm.trim().toLowerCase().replace(/-/g, '');

      // Filter books by title, author, or ISBN (removing dashes from ISBN).
      const filteredArray = books.filter(book =>
        (book.title && book.title.toLowerCase().includes(search)) || // Match title.
        (book.author && book.author.toLowerCase().includes(search)) || // Match author.
        (book.isbn && book.isbn.replace(/-/g, '').toLowerCase().includes(search)) // Match ISBN, ignoring dashes.
      );

      // Update the filteredBooks state with the filtered results.
      setFilteredBooks(filteredArray);
    }
  };

  // Inline styles for different parts of the component UI.
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

  // Return JSX for the BrowseBooks component.
  return (
    <div>
      {/* Search component */}
      <div style={searchContainerStyle}>
        <Search filterBooks={filterBooks} />
      </div>

      {/* Sorting component */}
      <div style={sortingContainerStyle}>
        <Sorting sortBooks={sortBooks} />
      </div>

      {/* Display books or a 'No books found' message */}
      <div style={pageStyle}>
        {filteredBooks.length > 0 ? (
          // Map over filteredBooks and render a BookCard for each.
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} userId={userId} />
          ))
        ) : (
          // Show this message if no books match the search/filter criteria.
          <div style={noBooksStyle}>No books found</div>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;