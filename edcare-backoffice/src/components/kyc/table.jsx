"use client";
import "../base/css/table.css";
import "../../app/kyc/kyc.css";
import { useState, useEffect } from "react";
import Pagination from "./pagination";
export default function Table() {
    const columnNames = ['客戶編號', '帳號名稱', '身份', '真實姓名', '手機號碼', '送審時間', '審核者/時間','狀態','詳細'];
    const [kycList, setKycList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [kycDetails, setKycDetails] = useState(null);
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [isEnable, setIsEnable] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editIsEnable, setEditIsEnable] = useState(false);

    const getKycList = async () => {
        const response = await fetch(`/api/kyc/getKycList?page=${currentPage}`, {
            method: 'GET',
        });
        const data = await response.json();
        setKycList(data.kycList);
        setOpenModal(false);
    }

    const getKycDetails = async () => {
        if (!editId) {
            console.error("editId is undefined, aborting request");
            return;
        }
    
        console.time("API Request Time");
        const response = await fetch(`/api/kyc/getKycDetails?id=${editId}`, {
            method: 'GET',
        });
        console.timeEnd("API Request Time");
    
        const data = await response.json();
    }

    useEffect(() => {
        getKycList();
    }, [currentPage]);

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
                {kycList.map((kyc, index) => (
                    <div key={index} style={{width: '100%', display: 'flex'}}>
                        <div className="table-body-column">
                            {kyc.id}
                        </div>
                        <div className="table-body-column">
                            {kyc.account}
                        </div>
                        <div className="table-body-column">
                            {kyc.job !== '保母' ? '家長' : '保母'}
                        </div>
                        <div className="table-body-column">
                            {kyc.name}
                        </div>
                        <div className="table-body-column">
                            {kyc.cellphone}
                        </div>
                        <div className="table-body-column">
                            {new Date(kyc.created_ts).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })}
                        </div>
                        <div className="table-body-column">
                            {new Date(kyc.updated_ts).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })}
                        </div>
                        <div className="table-body-column">
                            {kyc.status === '通過' ? (
                                <span className="kyc-table-status-allow">審核通過</span>
                            ) : kyc.status === '不通過' ? (
                                <span className="kyc-table-status-reject">審核不通過</span>
                            ) : (
                                <span className="kyc-table-status-pending">待審核</span>
                            )}
                        </div>
                        <div className="table-body-column">
                            {kyc.status === '通過' ? (
                                <button className="kyc-table-status-button-allow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                        <path d="M0 3.55556L14.2222 3.55556V5.33333L0 5.33333L0 3.55556ZM0 8.88889H14.2222V7.11111L0 7.11111L0 8.88889ZM0 12.4444H6.22222V10.6667H0L0 12.4444ZM0 16H6.22222V14.2222H0L0 16ZM10.1422 13.4844L8.88889 12.2222L7.63556 13.4756L10.1422 16L14.2222 11.9289L12.96 10.6667L10.1422 13.4844ZM0 0L0 1.77778L14.2222 1.77778V0L0 0Z" fill="#097201"/>
                                    </svg>
                                </button>
                            ) : kyc.status === '不通過' ? (
                                <button className="kyc-table-status-button-reject">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                        <path d="M0 3.55556L14.2222 3.55556V5.33333L0 5.33333L0 3.55556ZM0 8.88889H14.2222V7.11111L0 7.11111L0 8.88889ZM0 12.4444H6.22222V10.6667H0L0 12.4444ZM0 16H6.22222V14.2222H0L0 16ZM10.1422 13.4844L8.88889 12.2222L7.63556 13.4756L10.1422 16L14.2222 11.9289L12.96 10.6667L10.1422 13.4844ZM0 0L0 1.77778L14.2222 1.77778V0L0 0Z" fill="#78726D"/>
                                    </svg>
                                </button>
                            ) : (
                                <button className="kyc-table-status-button-pending">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                        <path d="M0 3.55556L14.2222 3.55556V5.33333L0 5.33333L0 3.55556ZM0 8.88889H14.2222V7.11111L0 7.11111L0 8.88889ZM0 12.4444H6.22222V10.6667H0L0 12.4444ZM0 16H6.22222V14.2222H0L0 16ZM10.1422 13.4844L8.88889 12.2222L7.63556 13.4756L10.1422 16L14.2222 11.9289L12.96 10.6667L10.1422 13.4844ZM0 0L0 1.77778L14.2222 1.77778V0L0 0Z" fill="#F76464"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="table-pagination">
                <Pagination totalItems={kycList.length} kycList={kycList} currentPage={currentPage} />
            </div>
        </div>
    );
}
