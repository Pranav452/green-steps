'use client'

import Link from 'next/link';

interface CTAProps {
  handleScrollTo: (id: string) => void;
}

export default function CTA({ handleScrollTo }: CTAProps) {
  return (
    <section id="join" className="w-full py-16 bg-gray-100">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-black font-mono">Join the Eco-Movement Today!</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8 font-mono">
          Make a difference together as we reduce waste and make positive impacts on the planet.
        </p>
        <div className="flex flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-black text-white font-medium rounded-full text-center hover:bg-gray-900 transition"
          >
            Get Started
          </Link>
          <button
            onClick={() => handleScrollTo('hero')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-full text-center hover:bg-gray-50 transition"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
} 