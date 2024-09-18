import React, { useState } from 'react';

// Search component that allows the user to input a search term and filter books based on the search.
const Search = ({ filterBooks }) => {
  // useState hook to manage the search term state.
  const [searchTerm, setSearchTerm] = useState('');

  // Handles the input field change, updating the search term in state.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Sets the search term from the input field.
  };

  // Handles the search button click, triggers the filterBooks function.
  const handleSearchClick = () => {
    // Calls filterBooks with the trimmed search term.
    filterBooks(searchTerm.trim());
  };

  // Handles 'Enter' key press to trigger the search function when the user presses Enter.
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '20px',
        color: 'white',
      }}
    >
      {/* Input field for entering the search term */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange} // Updates search term on input change.
        onKeyPress={handleKeyPress} // Initiates search when 'Enter' is pressed.
        placeholder="Search by book name or ISBN"
        style={{
          padding: '15px',
          fontSize: '1.2rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '83rem',
          backgroundColor: '#f8f9fa',
          color: '#333',
        }}
      />
      <button
        onClick={handleSearchClick} // Triggers search when clicked.
        style={{
          padding: '15px 30px',
          marginLeft: '10px',
          fontSize: '1rem',
          borderRadius: '5px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
