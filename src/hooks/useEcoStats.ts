'use client'; // This hook uses client-side state and effects

import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { startOfWeek, format, parseISO, eachDayOfInterval, isSameDay } from 'date-fns';

// Type for the raw data fetched from Supabase
type UserLogWithPoints = {
  date: string; // Expecting 'YYYY-MM-DD'
  eco_actions: {
    points: number;
  } | null; // Supabase join returns the related record as an object or null
};

// Type for daily summary
type DailyPoints = {
  date: string; // 'YYYY-MM-DD'
  points: number;
};

// Type for weekly summary
type WeeklyPoints = {
  weekStartDate: string; // 'YYYY-MM-DD' of the week's start (Sunday)
  points: number;
};

// Type for the hook's return value
export type EcoStats = {
  totalPoints: number;
  dailyPoints: DailyPoints[];
  weeklyPoints: WeeklyPoints[];
};

export type UseEcoStatsReturn = {
  stats: EcoStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Custom hook to fetch and process user eco stats.
 * Fetches all logs for the user, calculates total points,
 * and summarizes points daily and weekly.
 */
export function useEcoStats(userId: string | undefined): UseEcoStatsReturn {
  const { supabase } = useSupabase();
  const [stats, setStats] = useState<EcoStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false); // To trigger refetch

  const refetch = useCallback(() => {
    setRefreshToggle(prev => !prev);
  }, []);

  useEffect(() => {
    // Don't fetch if userId is not available
    if (!userId) {
      setIsLoading(false);
      setStats(null); // Clear stats if user logs out
      return;
    }

    const fetchAndProcessStats = async () => {
      setIsLoading(true);
      setError(null);
      setStats(null);

      try {
        // Fetch all logs with points for the user, ordered by date
        // Explicitly type the expected data structure
        const { data: logs, error: fetchError } = await supabase
          .from('user_logs')
          .select(`
            date,
            eco_actions ( points )
          `)
          .eq('user_id', userId)
          .order('date', { ascending: true })
          .returns<UserLogWithPoints[]>(); // Add .returns<Type[]>()

        if (fetchError) {
          console.error("Error fetching user logs:", fetchError);
          throw new Error('Failed to fetch eco stats.');
        }
        
        // Ensure logs is not null before processing
        if (!logs) {
           throw new Error('No log data returned.');
        }

        // Process the data
        let totalPoints = 0;
        const dailyMap: { [date: string]: number } = {};

        logs.forEach((log) => { // Type is now correctly inferred
          const points = log.eco_actions?.points ?? 0; // Default to 0 if null
          if (points > 0) {
            totalPoints += points;
            const dateStr = log.date; // Already 'YYYY-MM-DD'
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + points;
          }
        });

        // Fill gaps with 0 points for days within the range
        const processedDailyPoints: DailyPoints[] = [];
        if (logs.length > 0) {
          const firstDate = parseISO(logs[0].date);
          const lastDate = parseISO(logs[logs.length - 1].date);
          // Ensure start is not after end
          if (firstDate <= lastDate) { 
            const dateInterval = eachDayOfInterval({ start: firstDate, end: lastDate });
            dateInterval.forEach(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              processedDailyPoints.push({
                date: dateStr,
                points: dailyMap[dateStr] || 0,
              });
            });
          } else {
              // Handle case where first date is after last date (shouldn't happen with order)
              const dateStr = format(firstDate, 'yyyy-MM-dd');
              processedDailyPoints.push({ date: dateStr, points: dailyMap[dateStr] || 0 });
          }
        } else {
           // Handle case with no logs at all
           processedDailyPoints.push({ date: format(new Date(), 'yyyy-MM-dd'), points: 0});
        }

        // Calculate weekly stats
        const weeklyMap: { [weekStart: string]: number } = {};
        processedDailyPoints.forEach(day => {
          const weekStartDate = startOfWeek(parseISO(day.date), { weekStartsOn: 0 }); // 0 = Sunday
          const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
          weeklyMap[weekStartDateStr] = (weeklyMap[weekStartDateStr] || 0) + day.points;
        });

        const processedWeeklyPoints: WeeklyPoints[] = Object.entries(weeklyMap)
          .map(([weekStartDate, points]) => ({ weekStartDate, points }))
          .sort((a, b) => a.weekStartDate.localeCompare(b.weekStartDate)); // Sort chronologically

        setStats({
          totalPoints,
          dailyPoints: processedDailyPoints,
          weeklyPoints: processedWeeklyPoints,
        });

      } catch (err: any) {
        console.error("Error processing stats:", err);
        setError(err.message || 'An unexpected error occurred.');
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessStats();

    // Optional: Add cleanup function here if needed, e.g., for AbortController

  }, [userId, supabase, refreshToggle]); // Re-run if userId or supabase client changes, or on explicit refetch

  return { stats, isLoading, error, refetch };
} 