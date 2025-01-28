"use client";
import "./dashboard.css";
import DonutsChart from "@/components/base/dashboard/donutsChart";
import DonutsChartOrder from "@/components/base/dashboard/donutsChartOrder";
import SimpleBarChart from "@/components/base/dashboard/barChart";
import React, { useState, useEffect } from 'react';

export default function Page() {

    return (
      <div className="dashboard-main">
        <div className="dashboard-main-content">
          <div className="donut-chart-layout">
            <span className="chart-title">KYC 審核</span>
            <DonutsChart />
          </div>
          <div className="donut-chart-layout">
            <span className="chart-title">訂單情形</span>
            <DonutsChartOrder/>
          </div>
        </div>
        <div className="bar-chart-layout">
          <span className="chart-title">近七天新申請用戶數據</span>
          <SimpleBarChart/>
        </div>
      </div>
    );
  }