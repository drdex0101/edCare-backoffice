"use client";
import "./details.css";
import React, { useState, useEffect, use } from "react";
import { approvedNotify,failedNotify } from '../../util/notify';

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
            const fetchPromises = []; // 儲存所有的 fetch 請求
            if(data.kycDetails.identityfrontuploadid) {
              fetchPromises.push(fetchImgUrl(data.kycDetails.identityfrontuploadid, setImgFrontUrl));
            }
            if(data.kycDetails.identitybackuploadid) {
              fetchPromises.push(fetchImgUrl(data.kycDetails.identitybackuploadid, setImgBackUrl));
            }
            await Promise.all(fetchPromises); // 等待所有的 fetch 請求完成
            setLoading(false); // ✅ 設定 loading 為 false
        }
    };

    const fetchImgUrl = async (uploadId, setImageState) => {
        try {
            const response = await fetch(`/api/base/getImgUrl?id=${uploadId}`);
            const data = await response.json();
            setImageState(prev => prev !== data.url ? data.url : prev); // ✅ 確保 State 變更
        } catch (error) {
            console.error("Error fetching image URL:", error);
        }
    };

    const changeRichMenu = async (richMenuId, kycId) => {
      try {
        const response = await fetch("/api/base/line/changeRichMenu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            richMenuId: richMenuId,
            kycId: kycId,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Update Response:", data);
        window.location.reload();
      } catch (err) {
        console.error("Error updating status:", err);
        setError(err.message);
      }
    };
  
    const updateStatus = async (id, status,job,line_id) => {
      try {
        const response = await fetch(`/api/kyc/updateStatus`, {
            method: 'PATCH',
            body: JSON.stringify({ status, id }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json(); // 正確解析 response body
    
        if (!data.success) {
          throw new Error('Backend returned failure');
        }

        if (status === "approve") {
          approvedNotify(line_id);
        } else {
          failedNotify(line_id);
        }
    
        // 成功執行後續邏輯
        if (job === "保母") {
          changeRichMenu("richmenu-4cd0f0ee469a18663ccdb14f059b84d0", line_id);
        } else {
          changeRichMenu("richmenu-e8fbe1f3d2acf42b9f4b3020f033288a", line_id);
        }
        swal.fire({
          title: '完成',
          text: '審核完成',
          icon: 'success',
        });
      } catch (err) {
        console.error('Error updating status:', err);
        setError(err.message);
      }
    };


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

    if (loading) {
        return <div className="loading">資料加載中...</div>;
    }

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
                  <button className="details-header-back-button-reject" onClick={() => updateStatus(kycDetails?.id,'fail',kycDetails?.job,kycDetails?.line_id)}>
                    不通過
                  </button>
                  <button className="details-header-back-button-accept" onClick={() => updateStatus(kycDetails?.id,'approve',kycDetails?.job,kycDetails?.line_id)}>
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
                      style={{width: "100%",height: "100%"}}
                    />
                </div>
                <div className="identifyCard-border">
                  <img 
                    key={imgBackUrl} // 強制 React 重新渲染
                    src={imgBackUrl ? `${imgBackUrl}?t=${new Date().getTime()}` : "/identifyCard.png"} 
                    alt="身分證件" 
                    onClick={toggleBackModal}
                    style={{width: "100%",height: "100%"}}
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
                <img src={imgFrontUrl ? imgFrontUrl : "/identifyCard.png"} alt="身分證件" 
                style={{width: "100%",height: "100%"}}
                />  
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
                <img src={imgBackUrl ? imgBackUrl : "/identifyCard.png"} alt="身分證件" 
                style={{width: "100%",height: "100%"}}
                />
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
                <input type="text" className="input-layout" disabled value={kycDetails?.identitycard || ""}/>
            </div>
          </div>
          {kycDetails?.job === "保母" &&
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">保母登記證號（證書上的發文字號）</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.welfarecertno || ""}/>
            </div>
          </div>}
          <div style={{width: "100%",height: "1px",border: "1px solid #C1C1C1"}}></div>
          <span className="details-content-main-font">聯絡方式</span>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">戶籍地址</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.address || ""}/>
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">通訊地址</span>
                <input type="text" className="input-layout" disabled value={kycDetails?.communicateaddress || ""}/>
            </div>
          </div>
        </div>
      </div>
    );
  }