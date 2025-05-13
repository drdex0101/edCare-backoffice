"use client";
import "./details.css";
import React, { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
export default function Page({ params }) {
  const { id } = use(params); // 使用 `use()` 來解開 Promise
  const [kycDetails, setKycDetails] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ 加入 loading 狀態
  const [nannyList, setNannyList] = useState([]);
  const [selectedNannyId, setSelectedNannyId] = useState("");
  const [haveNannyId, setHaveNannyId] = useState(false);
  useEffect(() => {
    if (id) {
      fetchKycDetails();
      fetchHaveNannyId();
    }
  }, [id]); // 確保 `id` 存在時才執行

  const fetchHaveNannyId = async () => {
    const response = await fetch(`/api/order/checkHaveNanny?id=${id}`);
    const data = await response.json();
    setHaveNannyId(data.hasNannyId);
  };

  const fetchKycDetails = async () => {
    const response = await fetch(`/api/order/getPairNannyList?id=${id}`);
    const data = await response.json();
    if (data.success) {
      // 設定主要顯示的詳細資料（預設第一筆）
      setKycDetails(data.orderList[0]);

      // 整理出 nannyList 陣列
      const formattedNannyList = data.orderList.map((item) => ({
        nanny_id: item.nanny_id,
        nanny_name: item.nanny_name,
        nanny_cellphone: item.nanny_cellphone,
      }));

      setNannyList(formattedNannyList); // 設定進狀態
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, nannyId) => {
    try {
      const result = await Swal.fire({
        title: "確定與此保母簽約？",
        text: "其他媒合的保母將會取消配對，無法恢復。",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      });

      if (!result.isConfirmed) {
        return; // 使用者取消，什麼都不做
      }

      const response = await fetch(`/api/order/updateStatus`, {
        method: "PATCH",
        body: JSON.stringify({ status, id, nannyId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Backend returned failure");
      }

      // 可加上成功提示
      Swal.fire({
        title: "簽約成功",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire("錯誤", err.message || "未知錯誤", "error");
    }
  };

  useEffect(() => {
    if (nannyList.length > 0 && !selectedNannyId) {
      setSelectedNannyId(String(nannyList[0].nanny_id));
    }
  }, [nannyList]);

  if (loading) {
    return <div className="loading">資料加載中...</div>;
  }

  return (
    <div className="details-container">
      <div className="details-header">
        <Link href="/order">
          <span className="details-header-title">訂單管理</span>
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="5"
          height="8"
          viewBox="0 0 5 8"
          fill="none"
        >
          <path
            d="M0 6.5474L2.54444 3.9974L0 1.4474L0.783333 0.664062L4.11667 3.9974L0.783333 7.33073L0 6.5474Z"
            fill="#626262"
          />
        </svg>
        <div className="details-header-back-layout">
          <span className="details-header-back">訂單詳情</span>
        </div>
      </div>
      <div className="details-header-back-layout">
        <div className="details-header-back-button">
          {haveNannyId ? (
           <></>
          ) : (
            <button
            className="details-header-back-button-accept"
            onClick={() => updateStatus(id, "onGoing", selectedNannyId)}
          >
            確定簽約
          </button>
          )}
        </div>
      </div>
      <div className="content-layout">
        <div className="content-info">
          <div className="combine-layout">
            <span className="details-content-font">小孩暱稱</span>
            <input
              type="text"
              className="input-layout"
              disabled
              value={kycDetails?.order_nickname || ""}
            />
          </div>
          <div className="combine-layout">
            <span className="details-content-font">家長電話</span>
            <input
              type="text"
              className="input-layout"
              disabled
              value={kycDetails?.parent_cellphone || ""}
            />
          </div>
          <div className="combine-layout">
            <span className="details-content-font">保母姓名</span>
            <select
              className="input-layout-select"
              value={selectedNannyId}
              onChange={(e) => setSelectedNannyId(e.target.value)}
              disabled={haveNannyId}
            >
              {nannyList.map((nanny) => (
                <option key={nanny.nanny_id} value={String(nanny.nanny_id)}>
                  {nanny.nanny_name}
                </option>
              ))}
            </select>
          </div>

          <div className="combine-layout">
            <span className="details-content-font">保母電話</span>
            <input
              type="text"
              className="input-layout"
              value={
                nannyList.find((n) => String(n.nanny_id) === selectedNannyId)
                  ?.nanny_cellphone || ""
              }
              readOnly
            />
          </div>
        </div>
        <div className="content-info">
          <div className="combine-layout">
            <span className="details-content-font">托育方式</span>
            <input
              type="text"
              className="input-layout"
              disabled
              value={
                kycDetails?.care_type === "suddenly"
                  ? "臨時托育"
                  : kycDetails?.care_type === "longTern"
                  ? "長期托育"
                  : "無資料"
              }
            />
          </div>
          <div className="combine-layout">
            <span className="details-content-font">托育方式</span>
            <input
              type="text"
              className="input-layout"
              disabled
              value={
                kycDetails?.scenario === "home"
                  ? "在宅托育"
                  : kycDetails?.scenario === "toHome"
                  ? "到宅托育"
                  : kycDetails?.scenario === "infantCareCenter"
                  ? "定點托育"
                  : "無資料"
              }
            />
          </div>
        </div>
        <div className="content-info">
          <div className="combine-layout">
            <span className="details-content-font">托育地區</span>
            <input
              type="text"
              className="input-layout"
              disabled
              value={kycDetails?.location || ""}
            />
          </div>
        </div>
        <div className="content-info">
          <div className="combine-layout">
            <span className="details-content-font">托育時間</span>
            <input
              type="text"
              className="input-layout"
              disabled
              value={
                kycDetails?.care_type === "suddenly"
                  ? `日期：${kycDetails?.start_date?.slice(0, 10)} 時間：${
                      kycDetails?.start_time
                    } ~ ${kycDetails?.end_time}`
                  : kycDetails?.care_type === "longTern"
                  ? `日期：${kycDetails?.start_date?.slice(
                      0,
                      10
                    )} ~ ${kycDetails?.end_date?.slice(0, 10)}`
                  : "無資料"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
