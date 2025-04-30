'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';

// Type for the habits passed from the server
type EcoAction = {
  id: string;
  name: string;
  emoji: string;
  points: number;
  description?: string;
};

// Props for the form component
type LogEcoHabitFormProps = {
  ecoHabits: EcoAction[];
  userId: string;
};

// State structure to track selected habits and their notes
type SelectedHabitsState = {
  [key: string]: {
    selected: boolean;
    notes: string;
  };
};

export default function LogEcoHabitForm({ ecoHabits, userId }: LogEcoHabitFormProps) {
  const { supabase } = useSupabase();
  const router = useRouter();

  // Initialize state: an object where keys are habit IDs
  const initialSelectionState: SelectedHabitsState = ecoHabits.reduce((acc, habit) => {
    acc[habit.id] = { selected: false, notes: '' };
    return acc;
  }, {} as SelectedHabitsState);

  const [selectedHabits, setSelectedHabits] = useState<SelectedHabitsState>(initialSelectionState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().slice(0, 10);

  // Handler for checkbox changes
  const handleCheckboxChange = (habitId: string) => {
    setSelectedHabits(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        selected: !prev[habitId].selected,
        // Clear notes if unchecking
        notes: !prev[habitId].selected ? prev[habitId].notes : '',
      },
    }));
  };

  // Handler for notes input changes
  const handleNotesChange = (habitId: string, notesValue: string) => {
    // Only update notes if the habit is actually selected
    if (selectedHabits[habitId]?.selected) {
      setSelectedHabits(prev => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          notes: notesValue,
        },
      }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Filter out only the selected habits
    const habitsToLog = Object.entries(selectedHabits)
      .filter(([_, value]) => value.selected)
      .map(([habitId, value]) => ({ // Format for Supabase insert
        user_id: userId,
        action_id: habitId,
        date: todayDate,
        notes: value.notes || null,
      }));

    if (habitsToLog.length === 0) {
      setError('Please select at least one habit to log.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Insert all selected logs
      const { error: insertError } = await supabase
        .from('user_logs')
        .insert(habitsToLog);

      if (insertError) {
        // The DB unique constraint (user_id, action_id, date) prevents duplicates.
        // A bulk insert error might mean one or more failed.
        if (insertError.code === '23505') {
           setError('One or more selected habits have already been logged for today. Others were logged successfully if selected.');
           // Set success partially true? Or let error dominate? Error seems clearer.
           setSuccess(false);
        } else {
          console.error('Error inserting logs:', insertError);
          setError(insertError.message || 'An error occurred while logging habits.');
        }
        // Don't redirect or fully clear if there was an error
        setIsSubmitting(false);
        return; // Stop execution here after handling error
      }
      
      // If we reach here, insert was successful (or partially successful but no critical error other than duplicates)
      setSuccess(true);
      setError(null); // Clear any previous non-critical error
      // Reset form state
      setSelectedHabits(initialSelectionState);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh(); // Refresh dashboard data
      }, 2500);

    } catch (error: any) {
      console.error('Log submission error:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      // Setting submitting false is handled within error/success paths for clarity
      // setIsSubmitting(false); // Removed this general one
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm text-green-700 shadow-sm">
          Habit(s) logged successfully! Redirecting to dashboard...
        </div>
      )}

      <div className="space-y-4">
        <p className="text-lg font-medium text-gray-800">Select habits performed today ({todayDate}):</p>
        {ecoHabits.length > 0 ? (
          // Use flex column layout for the list of habits
          <div className="flex flex-col space-y-3">
            {ecoHabits.map((habit) => (
              // Each habit item
              <div key={habit.id} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 transition-colors duration-150">
                <div className="flex items-start space-x-3">
                  {/* Checkbox */}
                  <div className="flex h-5 items-center">
                    <input
                      id={`habit-${habit.id}`}
                      name={`habit-${habit.id}`}
                      type="checkbox"
                      checked={selectedHabits[habit.id]?.selected || false}
                      onChange={() => handleCheckboxChange(habit.id)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-1"
                    />
                  </div>
                  {/* Habit Info */}
                  <div className="min-w-0 flex-1 text-sm">
                    <label htmlFor={`habit-${habit.id}`} className="block cursor-pointer select-none font-medium text-gray-900">
                      <span className="mr-2 text-base">{habit.emoji}</span>
                      {habit.name}
                    </label>
                    {habit.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{habit.description}</p>
                    )}
                  </div>
                </div>
                {/* Notes Input (conditionally shown) */}
                {selectedHabits[habit.id]?.selected && (
                  <div className="mt-3 pl-7"> {/* Indent notes slightly */}
                    <label htmlFor={`notes-${habit.id}`} className="sr-only">
                      Notes for {habit.name}
                    </label>
                    <textarea
                      id={`notes-${habit.id}`}
                      name={`notes-${habit.id}`}
                      rows={2}
                      value={selectedHabits[habit.id]?.notes || ''}
                      onChange={(e) => handleNotesChange(habit.id, e.target.value)}
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm placeholder-gray-400"
                      placeholder={`Optional notes for ${habit.name}...`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No eco-habits found. Please add some first.</p>
        )}
      </div>

      <div className="flex justify-end border-t border-gray-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging Habits...' : 'Log Selected Habits'}
        </button>
      </div>
    </form>
  );
}