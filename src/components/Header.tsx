'use client'

import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
        <span className="text-xl font-bold text-black font-mono">GreenSteps</span>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6 mr-6">
            <div className="relative group">
              <Link href="/log-action" className="text-gray-800 hover:text-black py-3 inline-block text-sm font-mono">
                Log Actions
              </Link>
              <div className="absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4">
                  <h3 className="text-xs uppercase text-gray-500 mb-3 font-mono">Embrace the Moment</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">🌿</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Daily Logging</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">📊</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Weekly Progress Reports</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">🏆</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Eco Rewards</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">👋</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Join Community</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Link href="/impact" className="text-gray-800 hover:text-black py-3 inline-block text-sm font-mono">
                Impact Report
              </Link>
              <div className="absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4">
                  <h3 className="text-xs uppercase text-gray-500 mb-3 font-mono">Level Up Actions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">🌱</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Sustainable Living</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">♻️</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono    ">Eco-Friendly Choices</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">🌍</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Global Initiatives</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">🌟</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Get Inspired</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Link href="/community" className="text-gray-800 hover:text-black py-3 inline-block text-sm font-mono">
                Community Stats
              </Link>
              <div className="absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4">
                  <h3 className="text-xs uppercase text-gray-500 mb-3 font-mono">Community Highlights</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">👥</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono  ">Member Stories</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">📈</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Collective Impact</Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">🏅</span>
                      <Link href="#" className="text-sm text-gray-700 hover:text-black font-mono">Leaderboard</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <span className="text-gray-800 hover:text-black py-3 inline-block text-sm cursor-pointer font-mono">
                More Links ▾
              </span>
              <div className="absolute right-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4">
                  <h3 className="text-xs uppercase text-gray-500 mb-3 font-mono">From the Blog</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-2 flex items-center justify-center">
                        <span className="text-gray-400">📷</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-medium font-mono">Simple Ways to Reduce Waste</p>
                        <p className="text-xs text-gray-500 font-mono">12 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-2 flex items-center justify-center">
                        <span className="text-gray-400">📷</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-medium font-mono">Green Routines</p>
                        <p className="text-xs text-gray-500 font-mono">Integrate Sustainability Every Day</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Link href="/blog" className="text-xs text-gray-600 hover:text-black font-mono">
                        View All →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <Link href="/login" className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 font-mono">Sign In</Link>
          <Link href="/register" className="px-3 py-1.5 bg-black text-white rounded-md text-sm hover:bg-gray-800 font-mono">Sign Up</Link>
        </div>
      </div>
    </header>
  );
} 