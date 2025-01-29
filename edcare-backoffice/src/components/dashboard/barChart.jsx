"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
const SimpleBarChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
        try {
            const response = await fetch("/api/dashboard/countMemberForWeek");
            const result = await response.json();
            setData(result.data);
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
            <XAxis dataKey="date" />
            <YAxis dataKey="count" />
            <Tooltip />
            <Legend />
            <Bar 
                dataKey="count"
                fill="#FFD074" 
                barSize={20} 
            />
        </BarChart>
    );
};

export default SimpleBarChart;
