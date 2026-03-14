// src/HeroSection.jsx
import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-omni-dark text-gray-100 min-h-screen flex flex-col justify-center items-center font-sans overflow-hidden">
      {/* Background Subtle Gradient Effect */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      {/* Main Content Container */}
      <div className="container mx-auto px-6 py-24 text-center z-10">
        
        {/* The 'Luminous' Pulsing Shield Icon/Logo Area */}
        <div className="mb-12 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-omni-emerald opacity-20 blur-2xl transform scale-150 animate-pulse" />
                <div className="relative border-4 border-omni-emerald bg-omni-dark p-6 rounded-full shadow-lg">
                    {/* Placeholder OmniSight AI Icon (Replace with actual SVG/Image) */}
                    <svg className="w-16 h-16 text-omni-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Luminous/Emerald Gradient Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Income Protection, <br />
          <span className="bg-gradient-to-r from-green-300 via-omni-emerald to-emerald-600 bg-clip-text text-transparent">
            Automated by AI.
          </span>
        </h1>

        {/* Concise and Impactful Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
          AI-powered parametric insurance safeguards India's gig workforce. When weather, traffic, or platform disruptions hit, instant payouts trigger—no manual claims, no delays.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-omni-emerald text-omni-dark font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:bg-green-400 transition-colors duration-300 transform hover:scale-105 active:scale-95">
            Get Protected Now
          </button>
          
          <button className="border-2 border-gray-600 text-gray-300 font-semibold px-10 py-4 rounded-full text-lg hover:border-gray-400 hover:text-white transition-colors duration-300">
            Learn How It Works
          </button>
        </div>

      </div>

      {/* Optional: 'Disruption Map' Background Element (Purely visual placeholder for the idea) */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-omni-dark-card rounded-tl-full opacity-30 shadow-2xl z-0" />
    </section>
  );
};

export default HeroSection;