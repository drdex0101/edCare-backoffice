import React, { useState } from 'react';
import '../base/css/pagination.css';
const Pagination = ({ totalItems, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`page-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="page-button"
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="page-button"
      >
        &gt;
      </button>
    </div>
  );
};

const App = ({ totalItems,kycList,keyword }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Example page size
  const [kycPageList, setKycPageList] = useState([]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    getKycList();
  };

  const getKycList = async () => {
    const response = await fetch(`/api/kyc/getKycList?page=${currentPage}`, {
        method: 'GET',
    });
    const data = await response.json();
    setKycPageList(data.kycList);
  }

  return (
    <div>
      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        kycList={kycPageList} // Pass the function as a prop
      />
    </div>
  );
};

export default App;
