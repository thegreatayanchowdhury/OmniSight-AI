// src/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Shield, ArrowRight } from 'lucide-react';
import logo from './assets/logo.png'
const HeroSection = () => {
  return (
    <section className="bg-omni-dark text-gray-100 min-h-screen flex flex-col font-sans overflow-hidden relative ">

      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/10 via-green-400/10 to-emerald-600/10 blur-2xl"></div>
        <div className="flex items-center justify-between px-6 pt-4 pb-3 container mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={logo}
              alt="OmniSight AI"
              className="w-12 h-12"
            />
            <span className="text-xl font-bold text-white ">
              OmniSight <span className="text-omni-emerald">AI</span>
            </span>
          </div>
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a
              href="#"
              className="hover:text-omni-emerald transition-colors duration-300"
            >
              Solutions
            </a>
            <a
              href="#"
              className="hover:text-omni-emerald transition-colors duration-300"
            >
              Risk Models
            </a>
            <a
              href="#"
              className="hover:text-omni-emerald transition-colors duration-300"
            >
              Pricing
            </a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="text-sm font-semibold text-gray-300 hover:text-omni-emerald transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/auth"
              className="bg-omni-emerald text-omni-dark px-5 py-2.5 rounded-full text-sm font-bold hover:bg-green-400 transition-all shadow-lg shadow-omni-emerald/30"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO CONTENT --- */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 flex-grow flex flex-col justify-center items-center text-center z-10 py-20">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-omni-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-omni-emerald"></span>
          </span>
          <span className="text-xs font-bold tracking-widest uppercase text-gray-300">Hackathon Prototype v1.0</span>
        </div>
        

        <div className="relative inline-block">

          {/* glow effect */}
          <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/20 via-green-300/10 to-emerald-500/20 blur-3xl opacity-60"></div>

          <h1 className="relative text-5xl md:text-8xl font-extrabold mb-8 leading-[1.1] tracking-tight">
            Income Protection, <br />
            <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-green-600 bg-clip-text text-transparent bg-200 animate-gradientMove">
              Automated by AI.
            </span>
          </h1>

        </div>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The first AI-enabled parametric platform for India’s gig delivery workforce.
          Instant payouts triggered by external disruptions. No claims. No delays.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link to="/auth" className="group bg-omni-emerald text-omni-dark font-black px-10 py-5 rounded-full text-lg shadow-2xl hover:bg-green-400 transition-all flex items-center gap-2">
            Get Protected
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="bg-white/5 border border-white/10 text-white font-bold px-10 py-5 rounded-full text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            Watch Demo
          </button>
        </div>
      </div>
      {/* Background Decorative Blur */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-omni-emerald/10 rounded-full blur-[120px] -z-10" />

    </section>
  );
};

export default HeroSection;