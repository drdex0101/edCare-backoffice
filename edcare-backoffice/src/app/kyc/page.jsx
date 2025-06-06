"use client";
import "./kyc.css";
import React, { useState, useEffect } from 'react';
import Table from "../../components/kyc/table";
import Pagination from "../../components/base/pagination";
export default function Page() {
    const [kycList, setKycList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 搜尋關鍵字
    const [currentPage, setCurrentPage] = useState(1); // 分頁
    const [totalItems, setTotalItems] = useState(0); // 總筆數
    // 取得 KYC 列表
    const getKycList = async () => {
        try {
            const response = await fetch(
                `/api/kyc/getKycList?page=${currentPage}&search=${encodeURIComponent(searchTerm)}`,
                { method: "GET" }
            );
            const data = await response.json();
            
            if (data.success) {
                setKycList(data.kycList);
                setTotalItems(data.totalItems);
            } else {
                setKycList([]);
                console.error("Failed to fetch data:", data.message);
            }
        } catch (error) {
            console.error("Failed to fetch KYC list:", error);
            setKycList([]);
        }
    };

    // 當 `searchTerm` 或 `currentPage` 變化時，重新獲取資料
    useEffect(() => {
        getKycList();
    }, [searchTerm, currentPage]); // ✅ 監聽 `searchTerm` & `currentPage`

    // 搜尋時重置分頁
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // ✅ 重新查詢時重置為第 1 頁
    };

    return (
      <div className="kyc-main">
        <span className="kyc-title">KYC審核</span>
        <div className="kyc-content">
            <div className="kyc-table-search">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="kyc-table-search-input"
                        placeholder="請輸入關鍵字"
                        value={searchTerm}
                        onChange={handleSearchChange} // ✅ 讓 `searchTerm` 變化時，自動觸發 `useEffect`
                    />
                    <div style={{ cursor: 'pointer', zIndex: 1000 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="search-icon">
                            <rect width="24" height="24" fill="white"/>
                            <path d="M15.4351 14.0629H14.7124L14.4563 13.8159C15.3528 12.773 15.8925 11.4191 15.8925 9.94625C15.8925 6.66209 13.2304 4 9.94625 4C6.66209 4 4 6.66209 4 9.94625C4 13.2304 6.66209 15.8925 9.94625 15.8925C11.4191 15.8925 12.773 15.3528 13.8159 14.4563L14.0629 14.7124V15.4351L18.6369 20L20 18.6369L15.4351 14.0629V14.0629ZM9.94625 14.0629C7.66838 14.0629 5.82962 12.2241 5.82962 9.94625C5.82962 7.66838 7.66838 5.82962 9.94625 5.82962C12.2241 5.82962 14.0629 7.66838 14.0629 9.94625C14.0629 12.2241 12.2241 14.0629 9.94625 14.0629Z" fill="#C1C1C1"/>
                        </svg>
                    </div>
                </div>
            </div>
            {kycList.length > 0 ? (
                <>
                    <Table kycList={kycList} searchTerm={searchTerm} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                    <div className="table-pagination">
                        <Pagination 
                            totalItems={totalItems} 
                            kycList={kycList} 
                            currentPage={currentPage} 
                            searchTerm={searchTerm} 
                            setCurrentPage={setCurrentPage} 
                        />
                    </div>
                </>
            ) : (
                <div className="no-data-message">查無資料</div>
            )}
        </div>
      </div>
    );
  }