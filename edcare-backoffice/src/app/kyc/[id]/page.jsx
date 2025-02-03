"use client";
import "./details.css";
import React, { useState, useEffect, use } from "react";

import Link from "next/link";
export default function Page({ params }) {
    const { id } = use(params); // 使用 `use()` 來解開 Promise
    const [kycDetails, setKycDetails] = useState(null);
    const [imgFrontUrl, setImgFrontUrl] = useState(null);
    const [imgBackUrl, setImgBackUrl] = useState(null);
    const [isFrontModalOpen, setIsFrontModalOpen] = useState(false);
    const [isBackModalOpen, setIsBackModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // ✅ 加入 loading 狀態

    useEffect(() => {
        if (id) {
            fetchKycDetails();
        }
    }, [id]); // 確保 `id` 存在時才執行

    const fetchKycDetails = async () => { 
        const response = await fetch(`/api/kyc/getKycDetails?id=${id}`);
        const data = await response.json(); // ✅ 解析 JSON
        if (data.success) {
            setKycDetails(data.kycDetails);
            if(data.kycDetails.identityfrontuploadid) {
              fetchImgUrl(data.kycDetails.identityfrontuploadid, setImgFrontUrl);
            }
            if(data.kycDetails.identitybackuploadid) {
              fetchImgUrl(data.kycDetails.identitybackuploadid, setImgBackUrl);
            }
            setLoading(false); // ✅ 設定 loading 為 false
        }
    };

    const fetchImgUrl = async (uploadId, setImageState) => {
        try {
            const response = await fetch(`/api/base/getImgUrl?id=${uploadId}`);
            const data = await response.json();
            setImageState(prev => prev !== data.upload_url ? data.upload_url : prev); // ✅ 確保 State 變更
        } catch (error) {
            console.error("Error fetching image URL:", error);
        }
    };

    const changeRichMenu = async (richMenuId) => {
      try {
        const response = await fetch('/api/line/changeRichMenu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            userId: localStorage.getItem('lineId'), // 獲得 localStorage 的 line id
            richMenuId: richMenuId
          }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Update Response:', data);
        window.location.reload();
      } catch (err) {
        console.error('Error updating status:', err);
        setError(err.message);
      }
    };
  
    const updateStatus = async (id, status,job) => {
      try {
        const response =fetch(`/api/kyc/updateStatus`, {
            method: 'PATCH',
            body: JSON.stringify({ status, id }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (status == '通過') {
          if (job == '保母') {
            changeRichMenu('richmenu-80140f174c84df860ab6e4b2f1382634')
          }
          else {
            changeRichMenu('richmenu-dbfe9df32ebd1e9aba105ca6fc996955')
          }
        }
        window.location.reload();
      } catch (err) {
        console.error('Error updating status:', err);
        setError(err.message);
      }
    };

    useEffect(() => {
        console.log('KYC Details:', kycDetails); // Log to check if state updates
    }, [kycDetails]);

    const convertToTaiwanDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear() - 1911; // Convert to ROC year
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        return { year, month, day };
    };

    const { year, month, day } = kycDetails?.birthday ? convertToTaiwanDate(kycDetails.birthday) : { year: "", month: "", day: "" };

    const toggleFrontModal = () => {
        setIsFrontModalOpen(!isFrontModalOpen);
    };

    const toggleBackModal = () => {
        setIsBackModalOpen(!isBackModalOpen);
    };

    return (
      <div className="details-container">
        <div className="details-header">
            <Link href='/kyc'>
            <span className="details-header-title">KYC 審核</span>
            </Link>
            <svg xmlns="http://www.w3.org/2000/svg" width="5" height="8" viewBox="0 0 5 8" fill="none">
                <path d="M0 6.5474L2.54444 3.9974L0 1.4474L0.783333 0.664062L4.11667 3.9974L0.783333 7.33073L0 6.5474Z" fill="#626262"/>
            </svg>
            <div className="details-header-back-layout">
              <span className="details-header-back">基本資料</span>
            </div>
        </div>
        <div className="details-header-back-layout">
          <span className="details-content-main-font">基本資料</span>
          {kycDetails?.status === 'pending' && (
            <div className="details-header-back-button">
                  <button className="details-header-back-button-reject" onClick={() => updateStatus('不通過')}>
                    不通過
                  </button>
                  <button className="details-header-back-button-accept" onClick={() => updateStatus('通過')}>
                    通過
                  </button>
            </div>
          )}
        </div>
        <div className="identifyCard-layout">
            <span className="details-content-font">身分證件</span>
            <div className="identifyCard-layout-content">
                <div className="identifyCard-border">
                <img 
                    key={imgFrontUrl} // 強制 React 重新渲染
                    src={imgFrontUrl ? `${imgFrontUrl}?t=${new Date().getTime()}` : "/identifyCard.png"} 
                    alt="身分證件" 
                    onClick={toggleFrontModal}
                  />
                </div>
                <div className="identifyCard-border">
                  <img 
                    key={imgBackUrl} // 強制 React 重新渲染
                    src={imgBackUrl ? `${imgBackUrl}?t=${new Date().getTime()}` : "/identifyCard.png"} 
                    alt="身分證件" 
                    onClick={toggleBackModal}
                  />
                </div>
            </div>
        </div>
        {isFrontModalOpen && (
          <>
            <div className="modal-overlay" onClick={toggleFrontModal}></div>
            <div className="modal">
              <div className="modal-content">
              <span className="details-content-font">身分證正面</span>
                <img src={imgFrontUrl ? imgFrontUrl : "/identifyCard.png"} alt="身分證件" />
              </div>
            </div>
          </>
        )}
        {isBackModalOpen && (
          <>
            <div className="modal-overlay" onClick={toggleBackModal}></div>
            <div className="modal">
              <div className="modal-content">
              <span className="details-content-font">身分證背面</span>
                <img src={imgBackUrl ? imgBackUrl : "/identifyCard.png"} alt="身分證件" />
              </div>
            </div>
          </>
        )}
        <div className="content-layout">
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">真實姓名</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.name || ""}/>
            </div>
            <div className="combine-layout">
                <span className="details-content-font">性別</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.gender === 'male' ?  '男' : '女' || ""}/>
            </div>
          </div> 
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">出生年(民國)</span>
                <input type="text" className="input-layout" disabled value={year}/>
            </div>
            <div className="combine-layout">
                <span className="details-content-font">月</span>
                <input type="text" className="input-layout" disabled value={month}/>
            </div>
            <div className="combine-layout">
                <span className="details-content-font">日</span>
                <input type="text" className="input-layout" disabled value={day}/>
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">身分證字號</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.idNumber || ""}/>
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">居家式托育服務登記書號</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.idNumber || ""}/>
            </div>
          </div>
          <div style={{width: "100%",height: "1px",border: "1px solid #C1C1C1"}}></div>
          <span className="details-content-main-font">聯絡方式</span>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">戶籍地址</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.idNumber || ""}/>
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">通訊地址</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.idNumber || ""}/>
            </div>
          </div>
        </div>
      </div>
    );
  }