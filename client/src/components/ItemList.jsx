import React from 'react';

/**
 * ItemList Component
 * Renders a table of shopping list items.
 * @param {Array} items - Array of shopping items objects
 * Each item object: { item, category, brand, size, quantity, price }
 */
const ItemList = ({ items }) => {
  return (
    <div className="item-list-container">
      <h3>📝 Shopping List</h3>

      {/* Display message if no items are present */}
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <table className="item-table">
          {/* Table header */}
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {items.map(({ item, category, brand, size, quantity, price }, index) => (
              <tr key={index}>
                <td>{item}</td>
                <td>{category || 'Uncategorized'}</td>
                <td>{brand || 'any'}</td>
                <td>{size || 'any'}</td>
                <td>{quantity}</td>
                <td>{price !== undefined ? `${price} $` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemList;
