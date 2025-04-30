import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';
import { getSession } from '@/lib/supabase-server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import DashboardStats from '@/components/dashboard/DashboardStats';

export const metadata = {
  title: 'Dashboard - Green Steps',
  description: 'Track your eco-friendly actions',
};

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const userId = session.user.id;
  const userEmail = session.user.email;
  const supabase = createServerSupabaseClient();
  
  // Fetch user profile (needed for initial display values)
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('total_points, current_streak, longest_streak') // Only select needed fields
    .eq('id', userId)
    .single();

  // Fetch user badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select(`
      id,
      earned_at,
      badges (
        name,
        description,
        image_url
      )
    `)
    .eq('user_id', userId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-600">Dashboard</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">Signed in as: {userEmail}</p>
            <LogoutButton />
          </div>
        </div>

        <DashboardStats 
          userId={userId} 
          initialTotalPoints={userProfile?.total_points || 0}
          initialCurrentStreak={userProfile?.current_streak || 0}
          initialLongestStreak={userProfile?.longest_streak || 0}
        />

        {userBadges && userBadges.length > 0 && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-green-600">Your Badges</h2>
            <div className="flex flex-wrap gap-4">
              {userBadges.map((badge: any) => (
                <div key={badge.id} className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                  <span className="text-lg">{badge.badges.image_url}</span>
                  <span className="font-medium">{badge.badges.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-600">Log Actions</h2>
            <a
              href="/log-action"
              className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Log Today's Habits
            </a>
          </div>
           <p className="mt-2 text-gray-600">
             Click the button to log your eco-friendly habits for today.
            </p>
        </div>
      </div>
    </div>
  );
} 