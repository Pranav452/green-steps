import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-8">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center">
        <h1 className="text-center text-5xl font-bold text-green-600">
          Green Steps
        </h1>
        <p className="mt-4 text-center text-xl text-gray-700">
          Track your eco-friendly actions and make a positive impact on the environment
        </p>
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: 'Track Activities',
              description: 'Log your eco-friendly activities and see your progress over time.',
              icon: '🌱',
            },
            {
              title: 'Reduce Carbon Footprint',
              description: 'Get insights on how your actions are reducing your carbon footprint.',
              icon: '🌍',
            },
            {
              title: 'Join Challenges',
              description: 'Participate in community challenges and earn rewards.',
              icon: '🏆',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h2 className="mb-2 text-xl font-semibold text-green-600">{feature.title}</h2>
              <p className="text-center text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-full bg-green-600 px-8 py-3 text-center font-medium text-white shadow-md transition hover:bg-green-700 sm:w-auto"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-green-600 bg-transparent px-8 py-3 text-center font-medium text-green-600 transition hover:bg-green-50 sm:w-auto"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
