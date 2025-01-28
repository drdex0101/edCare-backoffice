import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SimpleBarChart = ({ data }) => {
    return (
        <BarChart
            width={800}
            height={230}
            data={data}
            margin={{
                top: 20, right: 30, left: 20, bottom: 5,
            }}
            style={{ backgroundColor: 'transparent' }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey="value" />
            <Tooltip />
            <Legend />
            <Bar 
                dataKey="value" 
                fill="#FFD074" 
                barSize={20} 
            />
        </BarChart>
    );
};

export default SimpleBarChart;
