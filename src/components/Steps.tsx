'use client'

import Link from 'next/link';

export default function Steps() {
  return (
    <section id="steps" className="w-full py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h3 className="text-sm uppercase text-gray-600 mb-2">Steps</h3>
          <h2 className="text-3xl font-bold mb-4 text-black font-mono">Your Eco-Friendly Journey Starts Here</h2>
          <p className="text-gray-700 max-w-2xl mb-8 font-mono">
            With GreenSteps, you can track your daily eco-habits and see the positive impact of your actions. Our platform empowers you by making sustainable and mindful choices accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-black font-mono">Step 1: Log Your Daily Eco-Habits</h3>
            <p className="text-gray-600 mb-6 font-mono">Record easy eco-actions as you go about your day.</p>
          </div>
          
          <div className="bg-white p-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-black font-mono">Step 2: Track Your Environmental Impact</h3>
            <p className="text-gray-600 mb-6 font-mono">View how your actions reduce your carbon footprint.</p>
          </div>
          
          <div className="bg-white p-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-black font-mono">Step 3: Earn Rewards and Recognition</h3>
            <p className="text-gray-600 mb-6 font-mono">Achieve badges and milestones for your efforts.</p>
          </div>
        </div>

      </div>
    </section>
  );
} 