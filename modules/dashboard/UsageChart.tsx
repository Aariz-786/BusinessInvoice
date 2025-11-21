
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../components/Card';
import { mockUtilityMeters } from '../../data/mockData';

const UsageChart: React.FC = () => {
    const processData = () => {
        const dataByMonth: { month: string; [key: string]: number | string }[] = [];
        const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

        months.forEach((month, index) => {
            const monthData: { month: string; [key: string]: number | string } = { month };
            mockUtilityMeters.forEach(meter => {
                const key = `${meter.unit} ${meter.utilityType}`;
                if (meter.historicalUsage[index] !== undefined) {
                    monthData[key] = meter.historicalUsage[index];
                }
            });
            dataByMonth.push(monthData);
        });
        return dataByMonth;
    };
    
    const chartData = processData();
    const colors = ['#3b82f6', '#ef4444', '#10b981'];

    return (
        <Card className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Utility Consumption Trends (kWh/CCF)</h2>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(chartData[0] || {}).filter(key => key !== 'month').map((key, index) => (
                             <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={2} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default UsageChart;
