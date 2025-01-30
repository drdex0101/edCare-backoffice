"use client";
import "./kyc.css";
import React, { useState, useEffect } from 'react';
import Table from "@/components/kyc/table";

export default function Page() {
    const [isCreateKycModalOpen, setIsCreateKycModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [identityCard, setIdentityCard] = useState("");
    const [welfareCertNo, setWelfareCertNo] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [isEnable, setIsEnable] = useState(false);
    const [kycList, setKycList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 存儲搜尋關鍵字
    const [currentPage, setCurrentPage] = useState(1); // 分頁

    // 呼叫 API 並傳遞 searchTerm
    const getKycList = async () => {
        try {
        const response = await fetch(
            `/api/kyc/getKycList?page=${currentPage}&search=${encodeURIComponent(searchTerm)}`,
            {
            method: "GET",
            }
        );
        const data = await response.json();
        setKycList(data.kycList);
        } catch (error) {
        console.error("Failed to fetch kyc list:", error);
        }
    };

    const handleCreateKyc = () => {
        setIsCreateKycModalOpen(true);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
    }

    const handlePhoneChange = (e) => {
        setCellphone(e.target.value);
    }

    const createKyc = async () => {
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
            setIsCreateKycModalOpen(false);
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
            if (isCreateKycModalOpen && !event.target.closest('.kyc-create-modal')) {
                setIsCreateKycModalOpen(false);
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
    }, [isCreateKycModalOpen]);

    return (
      <div className="kyc-main">
        <span className="kyc-title">KYC審核</span>
        <div className="kyc-content">
            <div className="kyc-table-search">
                <div className="input-wrapper">
                    <input type="text" className="kyc-table-search-input" placeholder="請輸入關鍵字" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <div onClick={() => getKycList()} style={{ cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="search-icon">
                            <rect width="24" height="24" fill="white"/>
                            <path d="M15.4351 14.0629H14.7124L14.4563 13.8159C15.3528 12.773 15.8925 11.4191 15.8925 9.94625C15.8925 6.66209 13.2304 4 9.94625 4C6.66209 4 4 6.66209 4 9.94625C4 13.2304 6.66209 15.8925 9.94625 15.8925C11.4191 15.8925 12.773 15.3528 13.8159 14.4563L14.0629 14.7124V15.4351L18.6369 20L20 18.6369L15.4351 14.0629V14.0629ZM9.94625 14.0629C7.66838 14.0629 5.82962 12.2241 5.82962 9.94625C5.82962 7.66838 7.66838 5.82962 9.94625 5.82962C12.2241 5.82962 14.0629 7.66838 14.0629 9.94625C14.0629 12.2241 12.2241 14.0629 9.94625 14.0629Z" fill="#C1C1C1"/>
                        </svg>
                    </div>
                </div>
            </div>
            <Table kycList={kycList} />
        </div>
        {isCreateKycModalOpen && (
          <>
            <div className="kyc-create-modal-backdrop"></div>
            <div className="kyc-create-modal">
              <span className="kyc-create-modal-title">KYC新增</span>
              <div className="kyc-create-modal-content">
                <div className="kyc-create-modal-content-item">
                  <span className="kyc-create-modal-content-item-title">電子信箱</span>
                    <input type="text" className="kyc-create-modal-content-item-input" placeholder="請輸入電子信箱" value={email} onChange={handleEmailChange}/>
                </div>
                <div className="kyc-create-modal-content-item">
                  <span className="kyc-create-modal-content-item-title">帳號名稱</span>
                  <input type="text" className="admin-create-modal-content-item-input" placeholder="請輸入帳號名稱" value={account} onChange={handleAccountChange}/>
                </div>
                <div className="kyc-create-modal-content-item">
                  <span className="kyc-create-modal-content-item-title">聯絡電話</span>
                  <input type="text" className="kyc-create-modal-content-item-input" placeholder="請輸入聯絡電話" value={cellphone} onChange={handlePhoneChange}/>
                </div>
                <div className="kyc-create-button-wrapper">
                    <button className="kyc-create-button" onClick={createKyc}>確認</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }