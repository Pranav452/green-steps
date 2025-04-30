'use client'

import { Inter } from 'next/font/google';
import { useSmoothScroll } from '@/components/SmoothScroll';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Impact from '@/components/Impact';
import Steps from '@/components/Steps';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const lenis = useSmoothScroll();

  const handleScrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <Hero handleScrollTo={handleScrollTo} />
      <Features handleScrollTo={handleScrollTo} />
      <Impact handleScrollTo={handleScrollTo} />
      <Steps />
      <CTA handleScrollTo={handleScrollTo} />
      <Footer handleScrollTo={handleScrollTo} />
    </div>
  );
}
