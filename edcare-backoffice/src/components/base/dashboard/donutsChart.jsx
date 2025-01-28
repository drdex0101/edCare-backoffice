import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';

const DonutsChart = ({ data }) => {
    const COLORS = ['#E8801D', '#FAA94D', '#FFD074'];
    const percentage = (value, total) => {
    return ((value / total) * 100).toFixed(2);
    }
    return (
        <PieChart width={400} height={340}>
        <Pie
            data={data}
            cx={200}
            cy={100}
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
        >
            {data.map((entry, index) => (
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
                <tspan x="205" y="100" dy="20" className="chart-center-label-num">100</tspan>
                </text>
            }
            />
        </Pie>
        <Legend 
            content={({ payload }) => {
            const total = data.reduce((sum, entry) => sum + entry.value, 0);
            return (
                <div style={{ display: 'flex', flexDirection: 'column',gap: '4px'}}>
                {payload.map((entry, index) => {
                    const percentage = ((entry.value / total) * 100).toFixed(2);
                    return (
                    <div key={`item-${index}`} style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',gap: '4px'}}>
                        <div style={{display: 'flex',alignItems: 'center',gap: '4px'}}>
                            <div style={{borderRadius: '50%',background: entry.color,width: '10px',height: '10px'}}></div>
                            <span style={{ color: entry.color }}>
                                {entry.value} 
                            </span>
                        </div>
                        <span style={{ color: entry.color }}>{entry.value}</span>
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
