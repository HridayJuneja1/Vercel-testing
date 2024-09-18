// Sorting component that allows the user to sort books based on the selected order.
const Sorting = ({ sortBooks }) => {

  // Handles the change event when a sorting option is selected.
  const handleSortChange = (e) => {
    const selectedOrder = e.target.value; // Get the selected sorting order (asc or desc).
    sortBooks(selectedOrder); // Calls the sortBooks function with the selected sorting order.
  };

  return (
    <div style={{ marginBottom: '20px', textAlign: 'right' }}>
      {/* Label for the sorting dropdown */}
      <label 
        htmlFor="sort-select" 
        style={{ marginRight: '10px', fontSize: '1.6rem', color: '#fff' }}
      >
        Sort by:
      </label>

      {/* Dropdown to select sorting order (A to Z or Z to A) */}
      <select
        id="sort-select"
        onChange={handleSortChange} // Trigger sorting when the selected option changes.
        style={{
          padding: '10px',
          fontSize: '1.3rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '200px',
          color: '#333',
        }}
      >
        <option value="">Select an option</option> {/* Default placeholder option */}
        <option value="asc">A to Z</option> {/* Sort books in ascending order */}
        <option value="desc">Z to A</option> {/* Sort books in descending order */}
      </select>
    </div>
  );
};

export default Sorting;