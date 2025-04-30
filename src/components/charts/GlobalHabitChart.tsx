'use client';

import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell // Import Cell for coloring bars
} from 'recharts';
import type { GlobalHabitStat } from '@/hooks/useGlobalStats'; // Import type

interface GlobalHabitChartProps {
    stats: GlobalHabitStat[];
    title?: string;
}

// Define some colors for the bars
const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#a78bfa', '#c4b5fd'];

const GlobalHabitChart: React.FC<GlobalHabitChartProps> = ({ 
    stats, 
    title = 'Most Logged Habits (All Users)' 
}) => {

    // Format data for the chart
    const chartData = React.useMemo(() => {
        if (!stats) return [];
        // Take top N habits or all if fewer
        const topStats = stats.slice(0, 10); 
        return topStats.map(item => ({
            name: `${item.emoji} ${item.name}`, // Combine emoji and name for label
            count: item.total_logs,
        }));
    }, [stats]);

    if (chartData.length === 0) {
        return <div className="text-center text-gray-500 py-4">No global habit data available yet.</div>;
    }

    return (
        <div className="h-96 w-full rounded-lg bg-white p-4 shadow-md">
             <h3 className="mb-4 text-lg font-semibold text-gray-700 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical" // Vertical bar chart
                    margin={{
                        top: 5,
                        right: 30, // More space for labels
                        left: 50,  // More space for Y-axis labels
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} /> 
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={120} // Adjust width as needed for habit names
                        tick={{ fontSize: 11 }} 
                        interval={0} // Ensure all labels are shown
                    /> 
                    <Tooltip 
                        contentStyle={{ fontSize: '12px', padding: '5px' }} 
                        formatter={(value: number, name: string, props: any) => [
                            `${value} logs`, // Show count with label
                            props.payload.name // Use the combined name as tooltip title part
                        ]}
                        // labelFormatter={(label: string) => `Habit: ${label}`} // Not needed if using name
                    />
                    {/* <Legend /> */}
                    <Bar dataKey="count" name="Total Logs" barSize={20}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GlobalHabitChart; 