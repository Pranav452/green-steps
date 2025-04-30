'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';

// Type for the aggregated stats data
export type GlobalHabitStat = {
  habit_id: string;
  total_logs: number;
  // Joined data from eco_actions
  name: string;
  emoji: string;
};

export type UseGlobalStatsReturn = {
  globalStats: GlobalHabitStat[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Custom hook to fetch and process global habit statistics.
 * Fetches total log counts per habit across all users.
 */
export function useGlobalStats(): UseGlobalStatsReturn {
  const { supabase } = useSupabase();
  const [globalStats, setGlobalStats] = useState<GlobalHabitStat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);

  const refetch = useCallback(() => {
    setRefreshToggle(prev => !prev);
  }, []);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      setIsLoading(true);
      setError(null);
      setGlobalStats([]);

      try {
        // Query to aggregate counts from user_logs and join with eco_actions
        // Note: This query runs against the raw table, respecting RLS if functions aren't used.
        // For true global stats ignoring RLS, an RPC function with SECURITY DEFINER is better.
        // Let's assume for now we want stats based on accessible logs (might be inaccurate globally)
        // A better approach would be a dedicated table updated by triggers or a backend process.
        
        // Simple aggregation (might be slow on large tables without dedicated stats table):
        const { data, error: fetchError } = await supabase
          .from('user_logs')
          .select(`
            action_id,
            eco_actions ( name, emoji )
          `); // Fetch all logs with action details

        if (fetchError) {
          console.error("Error fetching logs for global stats:", fetchError);
          throw new Error('Failed to fetch data for global stats.');
        }

        if (!data) {
            throw new Error('No data returned for global stats processing.');
        }
        
        // Aggregate in the client (less efficient than DB aggregation)
        const statsMap: { [key: string]: GlobalHabitStat } = {};

        data.forEach((log: any) => {
            if (!log.eco_actions) return; // Skip if action was deleted
            const habitId = log.action_id;
            if (!statsMap[habitId]) {
                statsMap[habitId] = {
                    habit_id: habitId,
                    total_logs: 0,
                    name: log.eco_actions.name,
                    emoji: log.eco_actions.emoji,
                };
            }
            statsMap[habitId].total_logs += 1;
        });

        const processedStats = Object.values(statsMap)
            .sort((a, b) => b.total_logs - a.total_logs); // Sort descending by count

        setGlobalStats(processedStats);

      } catch (err: any) {
        console.error("Error processing global stats:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalStats();

  }, [supabase, refreshToggle]);

  return { globalStats, isLoading, error, refetch };
}

/* 
// Alternative using RPC function (Recommended for performance & accuracy)
// 1. Create SQL function `get_global_habit_stats()` that aggregates counts.
// 2. Call it here: const { data, error } = await supabase.rpc('get_global_habit_stats');
CREATE OR REPLACE FUNCTION get_global_habit_stats()
RETURNS TABLE (habit_id UUID, total_logs BIGINT, name TEXT, emoji TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ul.action_id as habit_id,
    count(*) as total_logs,
    ea.name,
    ea.emoji
  FROM public.user_logs ul
  JOIN public.eco_actions ea ON ul.action_id = ea.id
  GROUP BY ul.action_id, ea.name, ea.emoji
  ORDER BY total_logs DESC;
$$;

GRANT EXECUTE ON FUNCTION get_global_habit_stats() TO authenticated; 
*/
