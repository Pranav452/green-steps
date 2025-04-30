'use client'

import Link from 'next/link';

interface HeroProps {
  handleScrollTo: (id: string) => void;
}

export default function Hero({ handleScrollTo }: HeroProps) {
  return (
    <section id="hero" className="w-full py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left Column - Text */}
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6 font-mono">
            Small Actions, Big Impact: Your Green Journey Starts Here
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-mono">
              Join the movement towards sustainability with GreenSteps. Log your daily eco-habits and visualize your positive impact on the planet.
            </p>
            <div className="flex flex-row gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-black text-white font-medium rounded-3xl text-center hover:bg-gray-900 transition"
              >
                Get Started
              </Link>
              <button
                onClick={() => handleScrollTo('features')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-3xl text-center hover:bg-gray-50 transition"
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="bg-gray-200 rounded-lg overflow-hidden h-80 md:h-96 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 