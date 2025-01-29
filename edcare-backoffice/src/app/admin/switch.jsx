import React from 'react';
import './switch.css'; // 確保有樣式

export default function Switch({ isOn, onChange }) {
    return (
        <div className={`switch ${isOn ? 'switch-on' : 'switch-off'}`} onClick={onChange}>
            <div className="switch-handle"></div>
        </div>
    );
}
