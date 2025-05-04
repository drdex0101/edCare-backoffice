"use client";
import "../base/css/table.css";
import "../../app/admin/admin.css";
import { useState, useEffect } from "react";
import Switch from "../../app/admin/switch";

export default function Table({adminList, columnNames}) {
    const [openModal, setOpenModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [adminDetails, setAdminDetails] = useState(null);
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [isEnable, setIsEnable] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editIsEnable, setEditIsEnable] = useState(false);

    const getAdminDetails = async () => {
        if (!editId) {
            console.error("editId is undefined, aborting request");
            return;
        }
    
        console.time("API Request Time");
        const response = await fetch(`/api/admin/getAdminDetails?id=${editId}`, {
            method: 'GET',
        });
        console.timeEnd("API Request Time");
    
        const data = await response.json();
        setAdminDetails(data.adminDetails);
        setIsEditModalOpen(true);
    }

    const handleModal = (id, is_enable) => {
        setOpenModal(true);
        setEditId(id);
        setEditIsEnable(is_enable);
    }

    const updateAdmin = async () => {
        const response = await fetch('/api/admin/editAdminDetails', {
            method: 'PATCH',
            body: JSON.stringify({ id: editId, email: email, account: account, cellphone: cellphone, is_enable: isEnable }),
        });
        const data = await response.json();
        if (data.success) {
            getAdminList();
            setIsEditModalOpen(false);
        }
    }

    const updateStatus = async () => {
        const response = await fetch('/api/admin/updateStatus', {
            method: 'PATCH',
            body: JSON.stringify({ id: editId, is_enable: editIsEnable }),
        });
        const data = await response.json();
        if (data.success) {
            getAdminList();
        }
    }

    const handleEdit = (id) => {
        setEditId(id);
    }

    useEffect(() => {
        if (editId !== null) {
            getAdminDetails();
        }
    }, [editId]);

    useEffect(() => {
        if (isEditModalOpen && adminDetails) {
            setEmail(adminDetails.email || "");
            setAccount(adminDetails.account || "");
            setCellphone(adminDetails.cellphone || "");
            setIsEnable(adminDetails.isEnable || false);
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
            if ((openModal || isEditModalOpen) && !event.target.closest('.admin-create-modal')) {
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
                {adminList.map((admin, index) => (
                    <div key={index} style={{width: '100%', display: 'flex'}}>
                        <div className="table-body-column">
                            {admin.id}
                        </div>
                        <div className="table-body-column">
                            {admin.account}
                        </div>
                        <div className="table-body-column">
                            {admin.email}
                        </div>
                        <div className="table-body-column">
                            {admin.cellphone}
                        </div>
                        <div className="table-body-column">
                            <Switch isOn={admin.is_enable} onChange={() => handleModal(admin.id, !admin.is_enable)} />
                        </div>
                        <div className="table-body-column">
                            {new Date(admin.created_ts).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })}
                        </div>
                        <div className="table-body-column">
                            <button className="editButton" onClick={() => handleEdit(admin.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M14.3297 9.35037L15.1474 10.168L7.0952 18.2202H6.27753V17.4026L14.3297 9.35037V9.35037ZM17.5293 4C17.3071 4 17.076 4.08888 16.9072 4.25774L15.2807 5.88418L18.6136 9.21705L20.24 7.59061C20.5867 7.24399 20.5867 6.68407 20.24 6.33745L18.1603 4.25774C17.9826 4.07999 17.7604 4 17.5293 4V4ZM14.3297 6.83516L4.5 16.6649V19.9978H7.83287L17.6626 10.168L14.3297 6.83516V6.83516Z" fill="white"/>
                                </svg>
                            </button>
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
                <div className="admin-create-modal-backdrop"></div>
                <div className="admin-create-modal">
                  <span className="admin-create-modal-title">帳號編輯</span>
                  <div className="admin-create-modal-content">
                    <div className="admin-create-modal-content-item">
                      <span className="admin-create-modal-content-item-title">電子信箱</span>
                      <input type="text" className="admin-create-modal-content-item-input" placeholder="請輸入電子信箱" value={email} onChange={handleEmailChange}/>
                    </div>
                    <div className="admin-create-modal-content-item">
                      <span className="admin-create-modal-content-item-title">帳號名稱</span>
                      <input type="text" className="admin-create-modal-content-item-input" placeholder="請輸入帳號名稱" value={account} onChange={handleAccountChange}/>
                    </div>
                    <div className="admin-create-modal-content-item">
                      <span className="admin-create-modal-content-item-title">聯絡電話</span>
                      <input type="text" className="admin-create-modal-content-item-input" placeholder="請輸入聯絡電話" value={cellphone} onChange={handlePhoneChange}/>
                    </div>
                    <div className="admin-enable-switch">
                        <span className="admin-create-modal-content-item-title">帳號啟用</span>
                        <Switch isOn={isEnable} onChange={handleEnableChange} />
                    </div>
                    <div className="admin-create-button-wrapper">
                        <button className="admin-create-button" onClick={updateAdmin}>確認</button>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
    );
}
