'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';

type EcoAction = {
  id: string;
  name: string;
  emoji: string;
  points: number;
  description?: string;
};

type LogActionFormProps = {
  ecoActions: EcoAction[];
  userId: string;
};

export default function LogActionForm({ ecoActions, userId }: LogActionFormProps) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10) // Today's date in YYYY-MM-DD format
  );
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!selectedAction) {
      setError('Please select an action');
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if user profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to handle null gracefully

      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw new Error('Could not check user profile.');
      }

      if (!profile) {
        console.log(`Profile not found for user ${userId}, creating one...`);
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          console.error('Error fetching user data for profile creation:', userError);
          throw new Error('Could not fetch user data to create profile.');
        }

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({ id: userId, email: userData.user.email || 'unknown@example.com' });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw new Error('Failed to create user profile.');
        }
        console.log(`Profile created for user ${userId}`);
      }

      // Now insert the log
      const { error: logInsertError } = await supabase
        .from('user_logs')
        .insert({
          user_id: userId,
          action_id: selectedAction,
          date,
          notes: notes || null,
        });

      if (logInsertError) {
        if (logInsertError.code === '23505') {
          // Unique constraint violation
          setError('You have already logged this action for today');
        } else {
          console.error('Error inserting log:', logInsertError);
          throw logInsertError;
        }
      } else {
        setSuccess(true);
        // Reset form
        setSelectedAction('');
        setNotes('');
        // Wait a bit before redirecting
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); // Ensure dashboard data is re-fetched
        }, 2000);
      }
    } catch (error: any) {
      console.error('Log submission error:', error);
      setError(error.message || 'An unexpected error occurred while logging the action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          Action logged successfully! Redirecting to dashboard...
        </div>
      )}

      <div>
        <label htmlFor="action" className="block text-sm font-medium text-gray-700">
          Select an eco-friendly action
        </label>
        <select
          id="action"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          required
        >
          <option value="">-- Select an action --</option>
          {ecoActions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.emoji} {action.name} (+{action.points} pts)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)} // Can't log future actions
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          placeholder="Add any details about this action..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-green-600 py-2 px-4 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Logging...' : 'Log Action'}
        </button>
      </div>
    </form>
  );
}