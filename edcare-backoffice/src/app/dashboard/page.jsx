"use client";
import "./dashboard.css";
import DonutsChart from "@/components/base/dashboard/donutsChart";
import SimpleBarChart from "@/components/base/dashboard/barChart";
import React, { useState, useEffect } from 'react';

export default function Page() {
  const [kycData, setKycData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchKycData = async () => {
    const response = await fetch('/api/dashboard/countKyc');
    const data = await response.json();
    setKycData(data);
  };

  const fetchOrderData = async () => {
    const response = await fetch('/api/dashboard/countOrder');
    const data = await response.json();
    setOrderData(data);
  };

  const fetchMemberData = async () => {
    const response = await fetch('/api/dashboard/countMemberForWeek');
    const data = await response.json();
    setMemberData(data);
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const storedKycData = localStorage.getItem('kycData');
        const storedOrderData = localStorage.getItem('orderData');
        const storedMemberData = localStorage.getItem('memberData');

        if (!storedKycData || !storedOrderData || !storedMemberData) {
          if (!isCancelled) {
            await fetchKycData();
            await fetchOrderData();
            await fetchMemberData();
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="dashboard-main">
      <div className="dashboard-main-content">
        <div className="donut-chart-layout">
          <span className="chart-title">KYC 審核</span>
          <DonutsChart data={kycData} />
        </div>
        <div className="donut-chart-layout">
          <span className="chart-title">訂單情形</span>
          <DonutsChart data={orderData} />
        </div>
      </div>
      <div className="bar-chart-layout">
        <span className="chart-title">近七天新申請用戶數據</span>
        <SimpleBarChart data={memberData} />
      </div>
    </div>
  );
}