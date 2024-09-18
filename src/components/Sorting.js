import React from 'react';

const Sorting = ({ sortBooks }) => {
  const handleSortChange = (e) => {
    const selectedOrder = e.target.value;
    sortBooks(selectedOrder);
  };

  return (
    <div style={{ marginBottom: '20px', textAlign: 'right' }}>
      <label htmlFor="sort-select" style={{ marginRight: '10px', fontSize: '1.6rem', color: '#fff' }}>
        Sort by:
      </label>
      <select
        id="sort-select"
        onChange={handleSortChange}
        style={{
          padding: '10px',
          fontSize: '1.3rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '200px',
          color: '#333',
        }}
      >
        <option value="">Select an option</option>
        <option value="asc">A to Z</option>
        <option value="desc">Z to A</option>
      </select>
    </div>
  );
};

export default Sorting;