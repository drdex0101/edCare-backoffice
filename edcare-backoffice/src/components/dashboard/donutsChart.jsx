"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';
import { useState, useEffect } from 'react';
const DonutsChart = () => {
    const COLORS = ['#E8801D', '#FAA94D', '#FFD074'];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    useEffect(() => {
        async function fetchData() {
        try {
            const response = await fetch("/api/dashboard/countKyc");
            const result = await response.json();
            // Map the API response to the format expected by the PieChart
            const formattedData = [
                { name: '尚未填寫KYC', value: parseInt(result.unWriteCount) },
                { name: '待審核KYC', value: parseInt(result.pendingCount) },
                { name: '未通過KYC', value: parseInt(result.rejectCount) },
            ];
            setData(formattedData);
            setTotalCount(parseInt(result.totalCount));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
      }

    return (
        <PieChart width={400} height={340} clipPathId="custom-clip-path-id">
        <Pie
            data={data}
            cx={200}
            cy={100}
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
        >
            {Array.isArray(data) && data.map((entry, index) => (
            <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]}
            />
            ))}
            <Label
            position="center"
            content={
                <text x={300} y={100} textAnchor="middle" dominantBaseline="central">
                <tspan x="205" y="90" dy="0" className="chart-center-label-font">總人數</tspan>
                <tspan x="205" y="100" dy="20" className="chart-center-label-num">{totalCount}</tspan>
                </text>
            }
            />
        </Pie>
        <Legend 
            content={() => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {data.map((entry, index) => {
                            return (
                                <div key={`item-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ borderRadius: '50%', background: COLORS[index % COLORS.length], width: '10px', height: '10px' }}></div>
                                        <span style={{ color: COLORS[index % COLORS.length] }}>
                                            {entry.name}
                                        </span>
                                    </div>
                                    <span style={{ color: COLORS[index % COLORS.length] }}>{entry.value}</span>
                                </div>
                            );
                        })}
                    </div>
                );
            }}
        />
        </PieChart>
    );
};

export default DonutsChart;
