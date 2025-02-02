import React, { useState, useEffect } from 'react';
import '../base/css/pagination.css';

export default function Pagination({totalItems,currentPage, setCurrentPage }) {
  const pageSize = 5; // 每頁顯示數量
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-button"
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => handlePageChange(i + 1)}
          className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-button"
      >
        &gt;
      </button>
    </div>
  );
}
