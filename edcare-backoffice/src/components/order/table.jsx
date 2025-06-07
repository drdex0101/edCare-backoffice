"use client";
import "../base/css/table.css";
import "../../app/order/order.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Table({ orderList, columnNames }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [isEnable, setIsEnable] = useState(false);

  const goToDetail = (order_id) => {
    router.push(`/order/${order_id}`);
  };

  const [nannyNameMap, setNannyNameMap] = useState({});

  useEffect(() => {
    const fetchNannyNames = async () => {
      const newMap = {};
      const idsToFetch = orderList
        .map((o) => o.nannyid)
        .filter((id) => id && !(id in nannyNameMap)); // 只 fetch 還沒載入過的 id

      const fetches = idsToFetch.map(async (id) => {
        const res = await fetch(`/api/order/getNannyName?nannyId=${id}`);
        const data = await res.json();
        newMap[id] = data.nannyName;
      });

      await Promise.all(fetches);

      setNannyNameMap((prev) => ({ ...prev, ...newMap }));
    };

    fetchNannyNames();
  }, [orderList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (openModal || isEditModalOpen) &&
        !event.target.closest(".order-create-modal")
      ) {
        setOpenModal(false);
        setIsEditModalOpen(false);
        setEmail("");
        setAccount("");
        setCellphone("");
        setIsEnable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal, isEditModalOpen]);

  function exportOrderListToCSV(orderList, nannyNameMap) {
    const headers = ["No.", "保母", "小孩暱稱", "托育情境", "狀態", "建立時間"];
    const csvRows = [headers.join(",")];

    for (const order of orderList) {
      const row = [
        order.id,
        order.nannyid ? nannyNameMap[order.nannyid] || "載入中..." : "尚未配對",
        order.nickname,
        order.choosetype === "suddenly" ? "臨時托育" : "長期托育",
        order.status === "create" ? "媒合中" : "已完成",
        order.created_ts?.slice(0, 10) || "",
      ];

      const escaped = row.map((val) =>
        typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val
      );

      csvRows.push(escaped.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "訂單列表.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="table-main">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          margin: "10px",
          width: "100%",
        }}
      >
        <button
          onClick={() => exportOrderListToCSV(orderList, nannyNameMap)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#EB9A38",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          匯出 CSV
        </button>
      </div>
      <div className="table-header">
        {columnNames.map((columnName, index) => (
          <div key={index} className="table-header-column">
            {columnName}
          </div>
        ))}
      </div>
      <div className="table-body">
        {orderList.map((order, index) => (
          <div key={index} style={{ width: "100%", display: "flex" }}>
            <div className="table-body-column">{order.id}</div>
            <div className="table-body-column">
              {order.nannyid
                ? nannyNameMap[order.nannyid] || "載入中..."
                : "尚未配對"}
            </div>
            <div className="table-body-column">{order.nickname}</div>
            <div className="table-body-column">
              {order.choosetype === "suddenly" ? "臨時托育" : "長期托育"}
            </div>
            <div className="table-body-column">
              <span className="order-status-success-font">
                {order.status === "create"
                  ? "媒合中"
                  : order.status === "fail"
                  ? "媒合失敗"
                  : "已完成"}
              </span>
            </div>
            <div className="table-body-column">
              {order.created_ts.slice(0, 10)}
            </div>
            <div className="table-body-column">
              <button
                className="kyc-table-status-button-allow"
                onClick={() => goToDetail(order.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="16"
                  viewBox="0 0 15 16"
                  fill="none"
                >
                  <path
                    d="M0 3.55556L14.2222 3.55556V5.33333L0 5.33333L0 3.55556ZM0 8.88889H14.2222V7.11111L0 7.11111L0 8.88889ZM0 12.4444H6.22222V10.6667H0L0 12.4444ZM0 16H6.22222V14.2222H0L0 16ZM10.1422 13.4844L8.88889 12.2222L7.63556 13.4756L10.1422 16L14.2222 11.9289L12.96 10.6667L10.1422 13.4844ZM0 0L0 1.77778L14.2222 1.77778V0L0 0Z"
                    fill="#097201"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
