'use client'

import Link from 'next/link';
import Image from 'next/image';

interface ImpactProps {
  handleScrollTo: (id: string) => void;
}

export default function Impact({ handleScrollTo }: ImpactProps) {
  return (
    <section id="impact" className="w-full py-16 bg-black text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 font-mono">Transform Your Habits, Impact the Planet</h2>
            <p className="mb-8 text-white font-mono ">
              Experience the satisfaction that comes from seeing your daily eco-actions add up. Join the community of eco-conscious individuals making a collective impact and be rewarded for your contribution to a healthier planet.
            </p>
            <div className="flex flex-row gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-white text-black font-medium rounded-md text-center hover:bg-gray-100 transition"
              >
                Join Now
              </Link>
              <button
                onClick={() => handleScrollTo('steps')}
                className="px-6 py-3 border border-white text-white font-medium rounded-md text-center cursor-pointer transition"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="People discussing eco-friendly practices"
                width={700}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 