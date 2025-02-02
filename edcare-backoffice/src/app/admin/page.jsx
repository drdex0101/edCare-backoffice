"use client";
import "./admin.css";
import React, { useState, useEffect } from 'react';
import Table from "../../components/base/table";
import Switch from "./switch";
import Pagination from "../../components/base/pagination";
export default function Page() {
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [account, setAccount] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [isEnable, setIsEnable] = useState(false);
    const [adminList, setAdminList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 存儲搜尋關鍵字
    const [currentPage, setCurrentPage] = useState(1); // 分頁
    const [totalItems, setTotalItems] = useState(0);
    // 呼叫 API 並傳遞 searchTerm
    const getAdminList = async () => {
        try {
        const response = await fetch(
            `/api/admin/getAdminList?page=${currentPage}&search=${encodeURIComponent(searchTerm)}`,
            {
            method: "GET",
            }
        );
        const data = await response.json();
        setAdminList(data.adminList);
        setTotalItems(data.totalItems);
        } catch (error) {
        console.error("Failed to fetch admin list:", error);
        }
    };

    const handleCreateAdmin = () => {
        setIsCreateAdminModalOpen(true);
    }

    const handleEnableChange = () => {
        console.log("Switch toggled:", !isEnable); // 確保事件觸發
        setIsEnable(prev => !prev);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
    }

    const handlePhoneChange = (e) => {
        setCellphone(e.target.value);
    }

    const createAdmin = async () => {
        const requestBody = { 
            email: email, 
            account: account, 
            cellphone: cellphone, 
            is_enable: isEnable 
        };
        console.log("Request Body:", requestBody);

        const response = await fetch('/api/admin/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            alert("新增成功");
            setIsCreateAdminModalOpen(false);
            setEmail("");
            setAccount("");
            setCellphone("");
            setIsEnable(false);
        } else {
            alert("新增失敗");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCreateAdminModalOpen && !event.target.closest('.admin-create-modal')) {
                setIsCreateAdminModalOpen(false);
                setEmail("");
                setAccount("");
                setCellphone("");
                setIsEnable(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCreateAdminModalOpen]);

    useEffect(() => {
        getAdminList();
    }, [searchTerm, currentPage]);

    return (
      <div className="admin-main">
        <span className="admin-title">權限管理</span>
        <div className="admin-content">
            <div className="admin-table-search">
                <div className="input-wrapper">
                    <input type="text" className="admin-table-search-input" placeholder="請輸入關鍵字" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <div onClick={() => getAdminList()} style={{ cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="search-icon">
                            <rect width="24" height="24" fill="white"/>
                            <path d="M15.4351 14.0629H14.7124L14.4563 13.8159C15.3528 12.773 15.8925 11.4191 15.8925 9.94625C15.8925 6.66209 13.2304 4 9.94625 4C6.66209 4 4 6.66209 4 9.94625C4 13.2304 6.66209 15.8925 9.94625 15.8925C11.4191 15.8925 12.773 15.3528 13.8159 14.4563L14.0629 14.7124V15.4351L18.6369 20L20 18.6369L15.4351 14.0629V14.0629ZM9.94625 14.0629C7.66838 14.0629 5.82962 12.2241 5.82962 9.94625C5.82962 7.66838 7.66838 5.82962 9.94625 5.82962C12.2241 5.82962 14.0629 7.66838 14.0629 9.94625C14.0629 12.2241 12.2241 14.0629 9.94625 14.0629Z" fill="#C1C1C1"/>
                        </svg>
                    </div>
                </div>
                <button className="admin-table-create-button" onClick={handleCreateAdmin}>
                    新增帳號
                </button>
            </div>
            {adminList.length > 0 ? (
                <>
                    <Table adminList={adminList} searchTerm={searchTerm} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                    <div className="table-pagination">
                        <Pagination 
                            totalItems={totalItems} 
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
        {isCreateAdminModalOpen && (
          <>
            <div className="admin-create-modal-backdrop"></div>
            <div className="admin-create-modal">
              <span className="admin-create-modal-title">帳號新增</span>
              <div className="admin-create-modal-content">
                <div className="admin-create-modal-content-item">
                  <span className="admin-create-modal-content-item-title">電子信箱</span>
                  <input type="text" className="admin-create-modal-content-item-input" placeholder="請輸入電子信箱" value={email} onChange={handleEmailChange}/>
                </div>
                <div className="admin-create-modal-content-item">
                  <span className="admin-create-modal-content-item-title">帳號名稱</span>
                  <input type="text" className="admin-create-modal-content-item-input" placeholder="請輸入帳號名稱" value={account} onChange={handleAccountChange}/>
                </div>
                <div className="admin-create-modal-content-item">
                  <span className="admin-create-modal-content-item-title">聯絡電話</span>
                  <input type="text" className="admin-create-modal-content-item-input" placeholder="請輸入聯絡電話" value={cellphone} onChange={handlePhoneChange}/>
                </div>
                <div className="admin-enable-switch">
                    <span className="admin-create-modal-content-item-title">帳號啟用</span>
                    <Switch isOn={isEnable} onChange={handleEnableChange} />
                </div>
                <div className="admin-create-button-wrapper">
                    <button className="admin-create-button" onClick={createAdmin}>確認</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }