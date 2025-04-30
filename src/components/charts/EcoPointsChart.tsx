'use client';

import React from 'react';
import { 
    ResponsiveContainer, 
    LineChart, 
    BarChart, 
    Line, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { EcoStats } from '@/hooks/useEcoStats'; // Import the type from the hook

type ChartDataPoint = {
    dateLabel: string; // Formatted date for display
    points: number;
};

interface EcoPointsChartProps {
    stats: EcoStats | null;
    chartType?: 'line' | 'bar';
    timePeriod?: 'daily' | 'weekly';
    title?: string;
}

const EcoPointsChart: React.FC<EcoPointsChartProps> = ({ 
    stats, 
    chartType = 'line', 
    timePeriod = 'daily', 
    title = 'Eco Points Over Time' 
}) => {

    // Format data for the chart based on the selected time period
    const chartData: ChartDataPoint[] = React.useMemo(() => {
        if (!stats) return [];

        if (timePeriod === 'weekly') {
            return stats.weeklyPoints.map(item => ({
                dateLabel: format(parseISO(item.weekStartDate), 'MMM d'), // Format as 'Jan 1'
                points: item.points,
            }));
        } else { // Daily
            // Optionally limit daily data points to avoid clutter, e.g., last 30 days
            const dailyPointsToShow = stats.dailyPoints; //.slice(-30); 
            return dailyPointsToShow.map(item => ({
                dateLabel: format(parseISO(item.date), 'MMM d'), // Format as 'Jan 1'
                points: item.points,
            }));
        }
    }, [stats, timePeriod]);

    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    const ChartElement = chartType === 'line' ? Line : Bar;

    if (!stats || chartData.length === 0) {
        // Render nothing or a placeholder if no data
        return <div className="text-center text-gray-500 py-4">No point data available yet.</div>;
    }

    return (
        <div className="h-80 w-full rounded-lg bg-white p-4 shadow-md">
             <h3 className="mb-4 text-lg font-semibold text-gray-700 text-center">{title} ({timePeriod === 'weekly' ? 'Weekly' : 'Daily'})</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 20, // Increased bottom margin for labels
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                        dataKey="dateLabel" 
                        angle={-45} // Angle labels to prevent overlap
                        textAnchor="end" 
                        height={50} // Allocate more height for angled labels
                        interval="preserveStartEnd" // Show first and last label
                        // Consider adding tickFormatter for more control if needed
                        // tickFormatter={(label) => label} 
                        tick={{ fontSize: 10 }} // Smaller font size
                    />
                    <YAxis 
                        allowDecimals={false} 
                        tick={{ fontSize: 10 }}
                        width={30} // Adjust width for Y-axis labels
                    />
                    <Tooltip 
                        contentStyle={{ fontSize: '12px', padding: '5px' }} 
                        formatter={(value: number) => [`${value} points`, null]} // Custom tooltip text
                        labelFormatter={(label: string) => `Date: ${label}`} // Custom label
                    />
                    {/* <Legend wrapperStyle={{ fontSize: '12px' }} /> */}
                    <ChartElement 
                        type="monotone" 
                        dataKey="points" 
                        stroke="#10B981" // Emerald 500
                        fill="#10B981" 
                        strokeWidth={chartType === 'line' ? 2 : 0}
                        dot={chartType === 'line' ? { r: 3, strokeWidth: 1 } : false}
                        activeDot={chartType === 'line' ? { r: 5 } : undefined}
                        barSize={chartType === 'bar' ? 20 : undefined}
                    />
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
};

export default EcoPointsChart; 