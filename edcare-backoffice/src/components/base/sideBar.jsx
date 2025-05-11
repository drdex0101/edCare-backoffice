"use client";

import Image from "next/image";
import "./css/sideBar.css";
import { useState } from "react";
import Link from "next/link";
export default function SideBar() {
    const [activeItem, setActiveItem] = useState('儀表板');
    const [showKYC, setShowKYC] = useState(false);
    const [showMember, setShowMember] = useState(false);
    const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    if (itemName === '審核') {
      setShowKYC(!showKYC);
    } else if (itemName === '會員管理') {
      setShowMember(!showMember);
    }
  };

  return (
    <div className="main">
      <div className="home-header">
        <Image src="/logo.png" alt="logo" width={167} height={50} />
        <div className="sub-title">
          <p className="sub-title-text">
              托育媒合服務系統
          </p>
        </div>
      </div>
        <Link href="/dashboard" className={`frame-layout ${activeItem === '儀表板' ? 'active' : ''}`} onClick={() => handleItemClick('儀表板')}>
            <div className="frame-layout-header-combine">
                <div className={`frame-layout-header ${activeItem === '儀表板' ? 'active' : ''}`}></div>
                <div className="frame-layout-header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <g clipPath="url(#clip0_356_32389)">
                            <path d="M18.2222 6.28559V8.06337H14.6667V6.28559H18.2222ZM9.33333 6.28559V11.6189H5.77778V6.28559H9.33333ZM18.2222 13.3967V18.73H14.6667V13.3967H18.2222ZM9.33333 16.9523V18.73H5.77778V16.9523H9.33333ZM20 4.50781H12.8889V9.84115H20V4.50781ZM11.1111 4.50781H4V13.3967H11.1111V4.50781ZM20 11.6189H12.8889V20.5078H20V11.6189ZM11.1111 15.1745H4V20.5078H11.1111V15.1745Z" 
                            fill={activeItem === '儀表板' ? '#EB9A38' : '#808080'}/>
                        </g>
                        <defs>
                            <clipPath id="clip0_356_32389">
                                <rect width="24" height="24" fill="white" transform="translate(0 0.507812)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className={`frame-layout-header-text ${activeItem === '儀表板' ? 'active' : ''}`}>
                    儀表板
                </div>
            </div>
        </Link>

        <Link href="/admin" className={`frame-layout ${activeItem === '權限管理' ? 'active' : ''}`} onClick={() => handleItemClick('權限管理')}>
            <div className="frame-layout-header-combine">
                <div className={`frame-layout-header ${activeItem === '權限管理' ? 'active' : ''}`}></div>
                <div className="frame-layout-header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <g clipPath="url(#clip0_356_32398)">
                        <path d="M18.6667 16.8411H14.6667V14.1745H12.88C12.12 15.7878 10.48 16.8411 8.66667 16.8411C6.09333 16.8411 4 14.7478 4 12.1745C4 9.60115 6.09333 7.50781 8.66667 7.50781C10.48 7.50781 12.1133 8.56115 12.88 10.1745H20V14.1745H18.6667V16.8411ZM16 15.5078H17.3333V12.8411H18.6667V11.5078H11.96L11.8067 11.0611C11.34 9.73448 10.0733 8.84115 8.66667 8.84115C6.82667 8.84115 5.33333 10.3345 5.33333 12.1745C5.33333 14.0145 6.82667 15.5078 8.66667 15.5078C10.0733 15.5078 11.34 14.6145 11.8067 13.2878L11.96 12.8411H16V15.5078ZM8.66667 14.1745C7.56667 14.1745 6.66667 13.2745 6.66667 12.1745C6.66667 11.0745 7.56667 10.1745 8.66667 10.1745C9.76667 10.1745 10.6667 11.0745 10.6667 12.1745C10.6667 13.2745 9.76667 14.1745 8.66667 14.1745ZM8.66667 11.5078C8.3 11.5078 8 11.8078 8 12.1745C8 12.5411 8.3 12.8411 8.66667 12.8411C9.03333 12.8411 9.33333 12.5411 9.33333 12.1745C9.33333 11.8078 9.03333 11.5078 8.66667 11.5078Z" 
                        fill={activeItem === '權限管理' ? '#EB9A38' : '#808080'}/>
                    </g>
                    <defs>
                        <clipPath id="clip0_356_32398">
                        <rect width="24" height="24" fill="white" transform="translate(0 0.507812)"/>
                        </clipPath>
                    </defs>
                </svg>
                </div>
                <div className={`frame-layout-header-text ${activeItem === '權限管理' ? 'active' : ''}`}>
                    權限管理
                </div>
            </div>
        </Link>
        <Link href="/order" className={`frame-layout ${activeItem === '訂單管理' ? 'active' : ''}`} onClick={() => handleItemClick('訂單管理')}>
            <div className="frame-layout-header-combine">
                <div className={`frame-layout-header ${activeItem === '訂單管理' ? 'active' : ''}`}></div>
                <div className="frame-layout-header-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M18.4 6.10781V15.7078H8.8V6.10781H18.4ZM18.4 4.50781H8.8C7.92 4.50781 7.2 5.22781 7.2 6.10781V15.7078C7.2 16.5878 7.92 17.3078 8.8 17.3078H18.4C19.28 17.3078 20 16.5878 20 15.7078V6.10781C20 5.22781 19.28 4.50781 18.4 4.50781ZM12.376 14.1078L9.6 11.3078L10.72 10.1798L12.376 11.8438L16.48 7.70781L17.6 8.83581L12.376 14.1078ZM5.6 7.70781H4V18.9078C4 19.7878 4.72 20.5078 5.6 20.5078H16.8V18.9078H5.6V7.70781Z" 
                fill={activeItem === '訂單管理' ? '#EB9A38' : '#808080'}/>
                    </svg>
                </div>
                <div className={`frame-layout-header-text ${activeItem === '訂單管理' ? 'active' : ''}`}>
                    訂單管理
                </div>
            </div>
        </Link>
        <div 
          className={`frame-layout ${activeItem === '會員管理' ? 'active' : ''}`}
          onClick={() => handleItemClick('會員管理')}
        >
            <div className="frame-layout-header-combine">
                <div className={`frame-layout-header ${activeItem === '會員管理' ? 'active' : ''}`}></div>
                <div className="frame-layout-header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M12 6.50781C13.1 6.50781 14 7.40781 14 8.50781C14 9.60781 13.1 10.5078 12 10.5078C10.9 10.5078 10 9.60781 10 8.50781C10 7.40781 10.9 6.50781 12 6.50781ZM12 15.5078C14.7 15.5078 17.8 16.7978 18 17.5078V18.5078H6V17.5178C6.2 16.7978 9.3 15.5078 12 15.5078V15.5078ZM12 4.50781C9.79 4.50781 8 6.29781 8 8.50781C8 10.7178 9.79 12.5078 12 12.5078C14.21 12.5078 16 10.7178 16 8.50781C16 6.29781 14.21 4.50781 12 4.50781V4.50781ZM12 13.5078C9.33 13.5078 4 14.8478 4 17.5078V20.5078H20V17.5078C20 14.8478 14.67 13.5078 12 13.5078V13.5078Z" 
                    fill={activeItem === '會員管理' ? '#EB9A38' : '#808080'}/>
                    </svg>
                </div>
                <div className={`frame-layout-header-text ${activeItem === '會員管理' ? 'active' : ''}`}>
                會員管理
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="11" viewBox="0 0 7 11" fill="none">
            <path d="M0 9.33281L3.81667 5.50781L0 1.68281L1.175 0.507812L6.175 5.50781L1.175 10.5078L0 9.33281Z" fill="#808080"/>
            </svg>
        </div>
        {showMember && (
          <>
            <Link 
              className={`frame-layout ${activeItem === '家長' ? 'active' : ''}`}
              href="/member/parent"
              onClick={() => handleItemClick('家長')}
            >
              <div className="frame-layout-header-combine">
                <div className={`frame-layout-header ${activeItem === '家長' ? 'active' : ''}`}></div>
                <div className="frame-layout-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" fill="none">
                    <path d="M5.00039 8.10625C6.98862 8.10625 8.60039 6.49448 8.60039 4.50625C8.60039 2.51802 6.98862 0.90625 5.00039 0.90625C3.01217 0.90625 1.40039 2.51802 1.40039 4.50625C1.40039 6.49448 3.01217 8.10625 5.00039 8.10625Z" 
                      fill={activeItem === '家長' ? '#EB9A38' : '#808080'}/>
                  </svg>
                </div>
                <div className={`frame-layout-header-text ${activeItem === '家長' ? 'active' : ''}`}>
                  家長
                </div>
              </div>
            </Link>
            <Link 
              className={`frame-layout ${activeItem === '保母' ? 'active' : ''}`}
              href="/member/nanny"
              onClick={() => handleItemClick('保母')}
            >
              <div className="frame-layout-header-combine">
                <div className={`frame-layout-header ${activeItem === '保母' ? 'active' : ''}`}></div>
                <div className="frame-layout-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" fill="none">
                    <path d="M5.00039 8.10625C6.98862 8.10625 8.60039 6.49448 8.60039 4.50625C8.60039 2.51802 6.98862 0.90625 5.00039 0.90625C3.01217 0.90625 1.40039 2.51802 1.40039 4.50625C1.40039 6.49448 3.01217 8.10625 5.00039 8.10625Z" 
                      fill={activeItem === '保母' ? '#EB9A38' : '#808080'}/>
                  </svg>
                </div>
                <div className={`frame-layout-header-text ${activeItem === '保母' ? 'active' : ''}`}>
                  保母
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
  );
}
