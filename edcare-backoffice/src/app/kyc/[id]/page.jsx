"use client";
import "./details.css";
import React, { useState, useEffect, use } from "react";
import { approvedNotify,failedNotify } from '../../util/notify';
import Swal from 'sweetalert2';
import { z } from "zod";

const updateSchema = z.object({
  line_id: z.string().optional(),
  cellphone: z.string().regex(/^09\d{8}$/, "請輸入有效的台灣手機號碼"),
  email: z.string().email("請輸入有效的 Email 格式"),
});

export default function Page({ params }) {
    const { id } = use(params); // 使用 `use()` 來解開 Promise
    const [kycDetails, setKycDetails] = useState(null);
    const [imgFrontUrl, setImgFrontUrl] = useState(null);
    const [imgBackUrl, setImgBackUrl] = useState(null);
    const [isFrontModalOpen, setIsFrontModalOpen] = useState(false);
    const [isBackModalOpen, setIsBackModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // ✅ 加入 loading 狀態
    const [cellphone, setCellphone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [communicateaddress, setCommunicateAddress] = useState("");

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
            setCellphone(data.kycDetails.cellphone || "");
            setEmail(data.kycDetails.email || "");
            setAddress(data.kycDetails.address || "");
            setCommunicateAddress(data.kycDetails.communicateaddress || "");
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
        Swal.fire({
          title: '錯誤',
          text: '發生未知錯誤，請稍後再試。',
          icon: 'error',
        });
      }
    };

    const updateAddress = async (id, address, communicateaddress) => {
      try {
        const response = await fetch(`/api/kyc/updateAddress`, {
          method: 'PATCH',
          body: JSON.stringify({ address, communicateaddress, id }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          Swal.fire({
            title: "完成",
            text: "地址更新成功",
            icon: "success",
          }).then(() => {
           window.location.reload();
          });
        } else {
          Swal.fire({
            title: "失敗",
            text: "地址更新失敗",
            icon: "error",
          });
        }
      } catch (err) {
        console.error("Error updating address:", err);
        Swal.fire({
          title: "錯誤",
          text: "發生未知錯誤，請稍後再試。",
          icon: "error",
        });
      }
    };
    const updateDetail = async (line_id, cellphone, email) => {
      try {
        // ✅ 驗證輸入格式
        const parsed = updateSchema.parse({ line_id, cellphone, email });
    
        const response = await fetch(`/api/member/updateMember`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed),
        });
    
        const data = await response.json();
    
        if (data.success) {
          Swal.fire({
            title: "完成",
            text: "編輯完成",
            icon: "success",
          }).then(() => {
            window.location.reload(); // ✅ 點擊確認後再刷新
          });
        } else {
          Swal.fire({
            title: "失敗",
            text: "編輯失敗",
            icon: "error",
          });
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errorMsg = err.errors.map((e) => e.message).join("\n");
          Swal.fire({
            title: "輸入錯誤",
            text: errorMsg,
            icon: "warning",
          });
        } else {
          console.error("Error updating detail:", err);
          Swal.fire({
            title: "錯誤",
            text: "發生未知錯誤，請稍後再試。",
            icon: "error",
          });
        }
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
            <span className="details-header-title">KYC 審核</span>
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
        <div className="content-layout">
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">手機</span>
                <input type="text" className="input-layout" value={cellphone} onChange={(e) => setCellphone(e.target.value)}/>
            </div>
            <div className="combine-layout">
                <span className="details-content-font">Email</span>
                <input type="text" className="input-layout" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="combine-layout">
                <span className="details-content-font">編輯</span>
                <button className="details-header-back-button-accept" onClick={() => updateDetail(kycDetails?.line_id, cellphone, email)}>
                    編輯
                </button>
            </div>
          </div> 
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
          <div style={{display: "flex",justifyContent: "space-between",alignItems: "center",gap: "10px"}}>
          <span className="details-content-main-font">聯絡方式</span>
          <button className="details-header-back-button-accept" onClick={() => updateAddress(kycDetails?.id, address, communicateaddress)}>
                    編輯
                </button>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">戶籍地址</span>
                <input type="text" className="input-layout" value={address} onChange={(e) => setAddress(e.target.value)}/>
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">通訊地址</span>
                <input type="text" className="input-layout" value={communicateaddress} onChange={(e) => setCommunicateAddress(e.target.value)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }