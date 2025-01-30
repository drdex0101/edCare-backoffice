"use client";
import "./details.css";
import React, { useState, useEffect } from 'react';

export default function Page() {

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
          <div className="details-header-back-button">
                <button className="details-header-back-button-reject">
                  不通過
                </button>
                <button className="details-header-back-button-accept">
                  通過
                </button>
          </div>
        </div>
        <div className="identifyCard-layout">
            <span className="details-content-font">身分證件</span>
            <div className="identifyCard-layout-content">
                <div className="identifyCard-border">
                  <img src="/identifyCard.png" alt="身分證件" />
                </div>
                <div className="identifyCard-border">
                  <img src="/identifyCard.png" alt="身分證件" />
                </div>
            </div>
        </div>
        <div className="content-layout">
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">真實姓名</span>
                <input type="text" className="input-layout" />
            </div>
            <div className="combine-layout">
                <span className="details-content-font">性別</span>
                <input type="text" className="input-layout" />
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">出生年(民國)</span>
                <input type="text" className="input-layout" />
            </div>
            <div className="combine-layout">
                <span className="details-content-font">月</span>
                <input type="text" className="input-layout" />
            </div>
            <div className="combine-layout">
                <span className="details-content-font">日</span>
                <input type="text" className="input-layout" />
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">身分證字號</span>
                <input type="text" className="input-layout" />
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">居家式托育服務登記書號</span>
                <input type="text" className="input-layout" />
            </div>
          </div>
          <div style={{width: "100%",height: "1px",border: "1px solid #C1C1C1"}}></div>
          <span className="details-content-main-font">聯絡方式</span>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">戶籍地址</span>
                <input type="text" className="input-layout" />
            </div>
          </div>
          <div className="content-info">
            <div className="combine-layout">
                <span className="details-content-font">通訊地址</span>
                <input type="text" className="input-layout" />
            </div>
          </div>
        </div>
      </div>
    );
  }