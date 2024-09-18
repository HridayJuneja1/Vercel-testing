import React, { useState } from 'react';

const Search = ({ filterBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    filterBooks(searchTerm.trim());
  };

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
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress} 
        placeholder="Search by book name"
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
        onClick={handleSearchClick}
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

//Search.test.js


