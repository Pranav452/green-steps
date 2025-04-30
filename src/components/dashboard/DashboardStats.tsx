'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic
import { useEcoStats } from '@/hooks/useEcoStats';
import { useGlobalStats } from '@/hooks/useGlobalStats'; // Import global stats hook
// Remove static import of the chart
// import EcoPointsChart from '@/components/charts/EcoPointsChart';

// Dynamically import the chart component with SSR disabled
const EcoPointsChart = dynamic(() => import('@/components/charts/EcoPointsChart'), {
    ssr: false, // Disable server-side rendering for this component
    loading: () => <p className="text-center text-gray-500 py-4">Loading points chart...</p>, // Optional loading state
});
const GlobalHabitChart = dynamic(() => import('@/components/charts/GlobalHabitChart'), {
    ssr: false,
    loading: () => <p className="text-center text-gray-500 py-4">Loading global chart...</p>,
});

interface DashboardStatsProps {
    userId: string; // User ID passed from the server component
    initialTotalPoints: number; // Pass initial values to avoid flicker
    initialCurrentStreak: number;
    initialLongestStreak: number;
}

export default function DashboardStats({ 
    userId, 
    initialTotalPoints,
    initialCurrentStreak,
    initialLongestStreak
}: DashboardStatsProps) {
    const { stats: userEcoStats, isLoading: isLoadingEco, error: errorEco } = useEcoStats(userId);
    const { globalStats, isLoading: isLoadingGlobal, error: errorGlobal } = useGlobalStats(); // Use global stats hook
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');
    const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly'>('daily');

    // Display initial values while loading or use hook values once available
    const displayTotalPoints = isLoadingEco ? initialTotalPoints : (userEcoStats?.totalPoints ?? initialTotalPoints);
    const displayCurrentStreak = isLoadingEco ? initialCurrentStreak : initialCurrentStreak; // Streak calculated on backend
    const displayLongestStreak = isLoadingEco ? initialLongestStreak : initialLongestStreak; // Streak calculated on backend

    return (
        <>
            {/* User Stats Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Total Points Card */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-semibold text-green-600">Your Impact</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Points</p>
                            <p className="text-2xl font-bold text-green-600">{displayTotalPoints.toFixed(2)}</p>
                        </div>
                        <div className="text-4xl">🌱</div>
                    </div>
                </div>
                {/* Current Streak Card */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-semibold text-green-600">Current Streak</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Days in a row</p>
                            <p className="text-2xl font-bold text-green-600">{displayCurrentStreak}</p>
                        </div>
                        <div className="text-4xl">🔥</div>
                    </div>
                </div>
                {/* Longest Streak Card */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-semibold text-green-600">Longest Streak</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Your best run</p>
                            <p className="text-2xl font-bold text-green-600">{displayLongestStreak}</p>
                        </div>
                        <div className="text-4xl">🏆</div>
                    </div>
                </div>
            </div>

            {/* Eco Points Chart Section */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-green-600">Your Points Trend</h2>
                    <div className="flex gap-2">
                         {/* Time Period Toggle */}
                        <select 
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value as 'daily' | 'weekly')}
                            className="text-xs rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                         {/* Chart Type Toggle */}
                         <select 
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
                            className="text-xs rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="line">Line</option>
                            <option value="bar">Bar</option>
                        </select>
                    </div>
                </div>
                {isLoadingEco && <p className="text-center text-gray-500">Loading points data...</p>}
                {errorEco && <p className="text-center text-red-600">Error loading points data: {errorEco}</p>}
                {!isLoadingEco && !errorEco && (
                    <EcoPointsChart stats={userEcoStats} chartType={chartType} timePeriod={timePeriod} />
                )}
            </div>

            {/* Global Habit Stats Chart Section */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
                 {isLoadingGlobal && <p className="text-center text-gray-500">Loading global stats...</p>}
                 {errorGlobal && <p className="text-center text-red-600">Error loading global stats: {errorGlobal}</p>}
                 {!isLoadingGlobal && !errorGlobal && (
                     <GlobalHabitChart stats={globalStats} />
                 )}
            </div>

            {/* You can add more summaries here if needed, e.g., weekly breakdown tables */}
        </>
    );
} 