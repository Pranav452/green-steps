import { redirect } from 'next/navigation';
import { getSession } from '@/lib/supabase-server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import LogEcoHabitForm from '@/components/actions/LogEcoHabitForm';

export const metadata = {
  title: 'Log Habits - Green Steps',
  description: 'Log your daily eco-friendly habits',
};

export default async function LogHabitPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const supabase = createServerSupabaseClient();
  
  // Fetch eco actions (habits)
  const { data: ecoHabits, error: fetchError } = await supabase
    .from('eco_actions')
    .select('id, name, emoji, points, description') // Select necessary fields
    .order('name');

  if (fetchError) {
    console.error('Error fetching eco habits:', fetchError);
    // Handle error display appropriately, maybe show an error message
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <a
            href="/dashboard"
            className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </a>
          <h1 className="mt-2 text-3xl font-bold text-green-600">Log Daily Habits</h1>
          <p className="mt-2 text-gray-600">
            Select the eco-friendly habits you performed today.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          {fetchError ? (
            <p className="text-center text-red-600">Could not load habits. Please try again later.</p>
          ) : (
            // Use the new form component
            <LogEcoHabitForm ecoHabits={ecoHabits || []} userId={session.user.id} />
          )}
        </div>
      </div>
    </div>
  );
}