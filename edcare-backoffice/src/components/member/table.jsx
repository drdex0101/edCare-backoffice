"use client";
import "../base/css/table.css";
import "../../app/member/member.css";
import { useState, useEffect } from "react";
import Switch from "../../app/admin/switch";

export default function Table({memberList, columnNames}) {
    const [openModal, setOpenModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [memberDetails, setMemberDetails] = useState(null);
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [isEnable, setIsEnable] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editIsEnable, setEditIsEnable] = useState(false);

    const handleModal = (id, is_enable) => {
        setOpenModal(true);
        setEditId(id);
        setEditIsEnable(is_enable);
    }

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

    const handleEdit = (id) => {
        setEditId(id);
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
        alert(isEnable);
        setIsEnable(!isEnable);
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
                {columnNames.map((columnName, index) => (
                    <div key={index} className="table-header-column">
                        {columnName}
                    </div>
                ))}
            </div>
            <div className="table-body">
                {memberList.map((member, index) => (
                    <div key={index} style={{width: '100%', display: 'flex'}}>
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
