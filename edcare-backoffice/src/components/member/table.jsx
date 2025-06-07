"use client";
import "../base/css/table.css";
import "../../app/member/member.css";
import { useState, useEffect } from "react";
import Switch from "../../app/admin/switch";
import { useRouter } from 'next/navigation';
export default function Table({memberList, columnNames}) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [memberDetails, setMemberDetails] = useState(null);
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [isEnable, setIsEnable] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editIsEnable, setEditIsEnable] = useState(false);

    const updateMember = async () => {
        const response = await fetch('/api/member/editMemberDetails', {
            method: 'PATCH',
            body: JSON.stringify({ id: editId, email: email, account: account, cellphone: cellphone, is_enable: isEnable }),
        });
        const data = await response.json();
        if (data.success) {
            getMemberList();
            setIsEditModalOpen(false);
        }
    }

    const updateStatus = async () => {
        const response = await fetch('/api/member/updateStatus', {
            method: 'PATCH',
            body: JSON.stringify({ id: editId, is_enable: editIsEnable }),
        });
        const data = await response.json();
        if (data.success) {
            getMemberList();
        }
    }

    useEffect(() => {
        if (editId !== null) {
            getMemberDetails();
        }
    }, [editId]);

    useEffect(() => {
        if (isEditModalOpen && memberDetails) {
            setEmail(memberDetails.email || "");
            setAccount(memberDetails.account || "");
            setCellphone(memberDetails.cellphone || "");
            setIsEnable(memberDetails.isEnable || false);
        }
    }, [isEditModalOpen]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
    }

    const handlePhoneChange = (e) => {
        setCellphone(e.target.value);
    }

    const handleEnableChange = (e) => {
        setIsEnable(!isEnable);
    }

    const goToDetail = (id,line_id) => {
        localStorage.setItem('line_id', line_id);
        router.push(`/kyc/${id}`);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((openModal || isEditModalOpen) && !event.target.closest('.member-create-modal')) {
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
            {columnNames.map((columnName, index) => {
            let stickyClass = "";
            if (index === 8) stickyClass = "sticky-col";

            return (
                <div key={index} className={`table-header-column ${stickyClass}`}>
                {columnName}
                </div>
            );
            })}
            </div>
            <div className="table-body">
                {memberList.map((member, index) => (
                    <div key={index} style={{display: 'flex'}}>
                        <div className="table-body-column">
                            {member.id}
                        </div>
                        <div className="table-body-column">
                            {member.account}
                        </div>
                        <div className="table-body-column">
                            {member.email}
                        </div>
                        <div className="table-body-column">
                            {member.cellphone}
                        </div>
                        <div className="table-body-column">
                            {member.job}
                        </div>
                        <div className="table-body-column">
                            {new Date(member.created_ts).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })}
                        </div>
                        <div className="table-body-column">
                            {member.created_ts ? new Date(member.created_ts).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }) : '-'}
                        </div>
                        <div className="table-body-column">
                            {member.update_ts ? new Date(member.update_ts).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }) : '-'}
                        </div>
                        <div className="table-body-column sticky-col">
                        {member.status === 'approve' ? (
                                <span className="kyc-table-status-allow">審核通過</span>
                            ) : member.status === 'fail' ? (
                                <span className="kyc-table-status-reject">審核不通過</span>
                            ) : (
                                <span className="kyc-table-status-pending">待審核</span>
                            )}
                            {member.status === 'approve' ? (
                                <button className="kyc-table-status-button-allow" disabled={member.id == null} onClick={() => goToDetail(member.id,member.line_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                        <path d="M0 3.55556L14.2222 3.55556V5.33333L0 5.33333L0 3.55556ZM0 8.88889H14.2222V7.11111L0 7.11111L0 8.88889ZM0 12.4444H6.22222V10.6667H0L0 12.4444ZM0 16H6.22222V14.2222H0L0 16ZM10.1422 13.4844L8.88889 12.2222L7.63556 13.4756L10.1422 16L14.2222 11.9289L12.96 10.6667L10.1422 13.4844ZM0 0L0 1.77778L14.2222 1.77778V0L0 0Z" fill="#097201"/>
                                    </svg>
                                </button>
                            ) : member.status === 'fail' ? (
                                <button className="kyc-table-status-button-reject" disabled={member.id == null} onClick={() => goToDetail(member.id,member.line_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                        <path d="M0 3.55556L14.2222 3.55556V5.33333L0 5.33333L0 3.55556ZM0 8.88889H14.2222V7.11111L0 7.11111L0 8.88889ZM0 12.4444H6.22222V10.6667H0L0 12.4444ZM0 16H6.22222V14.2222H0L0 16ZM10.1422 13.4844L8.88889 12.2222L7.63556 13.4756L10.1422 16L14.2222 11.9289L12.96 10.6667L10.1422 13.4844ZM0 0L0 1.77778L14.2222 1.77778V0L0 0Z" fill="#78726D"/>
                                    </svg>
                                </button>
                            ) : (
                                <button className="kyc-table-status-button-pending" disabled={member.id == null} onClick={() => goToDetail(member.id,member.line_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                        <path d="M0 3.55556L14.2222 3.55556V5.33333L0 5.33333L0 3.55556ZM0 8.88889H14.2222V7.11111L0 7.11111L0 8.88889ZM0 12.4444H6.22222V10.6667H0L0 12.4444ZM0 16H6.22222V14.2222H0L0 16ZM10.1422 13.4844L8.88889 12.2222L7.63556 13.4756L10.1422 16L14.2222 11.9289L12.96 10.6667L10.1422 13.4844ZM0 0L0 1.77778L14.2222 1.77778V0L0 0Z" fill="#F76464"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {openModal && (
                <>
                    <div className="backdrop" onClick={() => setOpenModal(false)}></div>
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-content-title">
                                帳號{editIsEnable ? '啟用' : '停用'}
                            </div>
                            <div className="modal-content-subTitle">
                            {editIsEnable ? '確定要啟用帳號？' : '確定要停用帳號？'}
                            </div>
                            <div className="modal-content-button-container">
                                <button className="modal-content-button" onClick={() => updateStatus()}>確認</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isEditModalOpen && (
                <>
                <div className="member-create-modal-backdrop"></div>
                <div className="member-create-modal">
                  <span className="member-create-modal-title">帳號編輯</span>
                  <div className="member-create-modal-content">
                    <div className="member-create-modal-content-item">
                      <span className="member-create-modal-content-item-title">電子信箱</span>
                      <input type="text" className="member-create-modal-content-item-input" placeholder="請輸入電子信箱" value={email} onChange={handleEmailChange}/>
                    </div>
                    <div className="member-create-modal-content-item">
                      <span className="member-create-modal-content-item-title">帳號名稱</span>
                      <input type="text" className="member-create-modal-content-item-input" placeholder="請輸入帳號名稱" value={account} onChange={handleAccountChange}/>
                    </div>
                    <div className="member-create-modal-content-item">
                      <span className="member-create-modal-content-item-title">聯絡電話</span>
                      <input type="text" className="member-create-modal-content-item-input" placeholder="請輸入聯絡電話" value={cellphone} onChange={handlePhoneChange}/>
                    </div>
                    <div className="member-enable-switch">
                        <span className="member-create-modal-content-item-title">帳號啟用</span>
                        <Switch isOn={isEnable} onChange={handleEnableChange} />
                    </div>
                    <div className="member-create-button-wrapper">
                        <button className="member-create-button" onClick={updateMember}>確認</button>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
    );
}
