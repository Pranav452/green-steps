'use client'

import { Award, Globe, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeaturesProps {
  handleScrollTo: (id: string) => void;
}

export default function Features({ handleScrollTo }: FeaturesProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <section id="features" className="w-full py-16 bg-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2 text-black font-mono">Eco</h2>
          <h2 className="text-3xl font-bold mb-4 text-black font-mono">Transform Your Habits, Transform the Planet</h2>
          <p className="text-gray-700 max-w-2xl">
            Join the movement towards sustainability with GreenSteps. Log your daily eco-habits, visualize your impact, and see the positive changes contributing to a healthier planet.
          </p>
          <div className="mt-6 flex gap-4">
            <Link href="/register" className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-black text-white">Get Started</Link>
            <button onClick={() => handleScrollTo('steps')} className="text-sm flex items-center  text-black">
              Learn More <span className="ml-1">→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
          >
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white transform group-hover:rotate-3 transition-transform">
                <Leaf className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center font-mono text-black">Daily Eco-Action Logging Made Simple</h3>
            <p className="text-center text-gray-600 font-mono">Easily track all eco-habits in one place with our intuitive dashboard.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeInUp}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
          >
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white transform group-hover:rotate-3 transition-transform">
                <Globe className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center font-mono text-black">Visualize Your Environmental Impact</h3>
            <p className="text-center text-gray-600 font-mono">See your ecological and carbon savings grow with beautiful analytics.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={fadeInUp}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
          >
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white transform group-hover:rotate-3 transition-transform">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center font-mono text-black">Earn Badges and Celebrate Milestones</h3>
            <p className="text-center text-gray-600 font-mono">Stay motivated by seeing rewards for your consistent eco-friendly efforts.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 