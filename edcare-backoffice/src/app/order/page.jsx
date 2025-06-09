"use client";
import "./order.css";
import React, { useState, useEffect } from 'react';
import Table from "../../components/order/table";
import Pagination from "../../components/base/pagination";
export default function Page() {
    const [orderList, setorderList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 搜尋關鍵字
    const [currentPage, setCurrentPage] = useState(1); // 分頁
    const [totalItems, setTotalItems] = useState(0); // 總筆數
    const [filterStatus, setFilterStatus] = useState("all"); // 篩選狀態
    const [period, setPeriod] = useState("all"); // 篩選時間
    const [filterSituation, setFilterSituation] = useState("all"); // 篩選情境

    const columnNames = ['No.', '保母', '小孩暱稱','托育情境', '狀態', '建立時間','詳情'];
    // 取得 order 列表
    const getorderList = async () => {
        try {
            const response = await fetch(
                `/api/order/getOrderList?page=${currentPage}&filterStatus=${filterStatus}&period=${period}&filterSituation=${filterSituation}&searchTerm=${searchTerm}`,
                { method: "GET" }
            );
            const data = await response.json();
            
            if (data.success) {
                setorderList(data.orderList);
                setTotalItems(data.totalItems);
            } else {
                setorderList([]);
                console.error("Failed to fetch data:", data.message);
            }
        } catch (error) {
            console.error("Failed to fetch order list:", error);
            setorderList([]);
        }
    };
    // 當 `searchTerm` 或 `currentPage` 變化時，重新獲取資料
    useEffect(() => {
        getorderList();
    }, [searchTerm, currentPage, filterStatus, period, filterSituation]); // ✅ 監聽 `searchTerm` & `currentPage`

    // 搜尋時重置分頁
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // ✅ 重新查詢時重置為第 1 頁
    };

    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
      };

      const handleSituationChange = (e) => {
        setFilterSituation(e.target.value);
        setCurrentPage(1);
      };

      const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        setCurrentPage(1);
      };
      
    return (
      <div className="order-main">
        <span className="order-title">訂單管理</span>
        <div className="order-content">
            <div className="order-table-search">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="order-table-search-input"
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
                <div className="order-select-font-option">
                    <span className="order-select-font">托育情境</span>
                    <select
                        className="order-table-search-input"
                        onChange={handleSituationChange}
                    >
                        <option value="all">全部</option>
                        <option value="longTern">長期托育</option>
                        <option value="suddenly">臨時托育</option>
                    </select>
                </div>
                <div className="order-select-font-option">
                    <span className="order-select-font">狀態篩選</span>
                    <select
                        className="order-table-search-input"
                        onChange={handleStatusChange}
                    >
                        <option value="all">全部</option>
                        <option value="onGoing">已完成</option>
                        <option value="matchPending">預約中</option>
                        <option value="signing">接洽中</option>
                        <option value="create">媒合中</option>
                        <option value="fail">媒合失敗</option>
                    </select>
                </div>
                <div className="order-select-font-option">
                    <span className="order-select-font">時間篩選</span>
                <select
                    className="order-table-search-input"
                    onChange={handlePeriodChange}
                >
                    <option value="all">全部</option>
                    <option value="1month">一個月</option>
                    <option value="3month">三個月</option>
                    <option value="6month">六個月</option>
                </select>
               </div>
            </div>
            {orderList.length > 0 ? (
                <>
                    <Table orderList={orderList} columnNames={columnNames}/>
                    <div className="table-pagination">
                        <Pagination 
                            totalItems={totalItems} 
                            orderList={orderList} 
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