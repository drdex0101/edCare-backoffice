"use client";
import "../base/css/table.css";
import "../../app/order/order.css";
import { useState, useEffect } from "react";

export default function Table({orderList, columnNames}) {
    const [openModal, setOpenModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [isEnable, setIsEnable] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editIsEnable, setEditIsEnable] = useState(false);

    const handleMatchSuccess = async (id) => {
        const response = await fetch('/api/order/updateStatus', {
            method: 'PATCH',
            body: JSON.stringify({ id: id, status: 'onGoing' }),
        });
        location.reload();
    }

    const handleMatchReject = async (id) => {
        const response = await fetch('/api/order/updateStatus', {
            method: 'PATCH',
            body: JSON.stringify({ id: id, status: 'create' }),
        });
        location.reload();
    }
    useEffect(() => {
        if (isEditModalOpen && orderDetails) {
            setEmail(orderDetails.email || "");
            setAccount(orderDetails.account || "");
            setCellphone(orderDetails.cellphone || "");
            setIsEnable(orderDetails.isEnable || false);
        }
    }, [isEditModalOpen]);




    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((openModal || isEditModalOpen) && !event.target.closest('.order-create-modal')) {
                setOpenModal(false);
                setIsEditModalOpen(false);
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
    }, [openModal, isEditModalOpen]);

    return (
        <div className="table-main">
            <div className="table-header">
                {columnNames.map((columnName, index) => (
                    <div key={index} className="table-header-column">
                        {columnName}
                    </div>
                ))}
            </div>
            <div className="table-body">
                {orderList.map((order, index) => (
                    <div key={index} style={{width: '100%', display: 'flex'}}>
                        <div className="table-body-column">
                            {order.id}
                        </div>
                        <div className="table-body-column">
                            {order.nanny_name}
                        </div>
                        <div className="table-body-column">
                            {order.order_nickname}
                        </div>
                        <div className="table-body-column">
                            <span className="order-status-success-font">
                                {order.status === "create"
                                    ? "媒合中"
                                    : order.status === "matchByParent" || order.status === "matchByNanny"
                                        ? "預約中"
                                        : order.status === "signing"
                                            ? "簽約中"
                                            : order.status === "onGoing"
                                                ? "合約履行中"
                                                : order.status === "finish"
                                                    ? "已完成"
                                                    : "媒合中"}
                            </span>
                        </div>
                        <div className="table-body-column">
                            {order.created_time.slice(0, 10)}
                        </div>
                        <div className="table-body-column">
                            <button className="table-body-column-button" onClick={() => handleMatchSuccess(order.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="table-body-column">
                            <button className="table-body-column-button" onClick={() => handleMatchReject(order.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
