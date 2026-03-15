import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import logo from "./assets/logo.png";
import { TypeAnimation } from "react-type-animation";

const HeroSection = () => {

  const [mobileMenu, setMobileMenu] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  return (
    <section className="bg-omni-dark text-gray-100 min-h-screen flex flex-col font-sans overflow-hidden relative pt-14 md:pt-16">

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-all duration-300
        ${scrolled
          ? "bg-white/5 border-b border-emerald-400/20 shadow-lg shadow-emerald-500/10"
          : "bg-transparent"
        }`}
      >

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/10 via-green-400/10 to-emerald-600/10 blur-2xl"></div>

        <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 container mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="OmniSight AI" className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-lg sm:text-xl font-bold text-white">
              OmniSight <span className="text-omni-emerald">AI</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">

            {/* Solutions Dropdown */}
            <div className="relative group">

              <button className="flex items-center gap-1 hover:text-omni-emerald transition">
                Solutions
                <ChevronDown size={16} />
              </button>

              <div className="absolute top-10 left-0 opacity-0 translate-y-2 scale-95
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                pointer-events-none group-hover:pointer-events-auto
                transition-all duration-300">

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-5 w-60 shadow-2xl shadow-emerald-500/10">

                  <a href="#" className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-omni-emerald transition">
                    Delivery Protection
                  </a>

                  <a href="#" className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-omni-emerald transition">
                    Risk Models
                  </a>

                  <a href="#" className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-omni-emerald transition">
                    Smart Triggers
                  </a>

                </div>

              </div>
            </div>

            <a href="#" className="hover:text-omni-emerald transition">
              Pricing
            </a>

          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">

            <Link
              to="/auth"
              className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-omni-emerald transition"
            >
              Log in
            </Link>

            <Link
              to="/auth"
              className="hidden sm:block bg-omni-emerald text-omni-dark px-5 py-2.5 rounded-full text-sm font-bold hover:bg-green-400 transition shadow-lg shadow-omni-emerald/30"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (

          <div className="md:hidden px-6 pb-6 pt-4 bg-white/5 backdrop-blur-xl border-t border-white/10">

            <div className="flex flex-col gap-4 text-gray-300">

              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className="flex justify-between items-center"
              >
                Solutions
                <ChevronDown size={18} />
              </button>

              {solutionsOpen && (
                <div className="pl-4 flex flex-col gap-2 text-sm text-gray-400">

                  <a href="#">Delivery Protection</a>
                  <a href="#">Risk Models</a>
                  <a href="#">Smart Triggers</a>

                </div>
              )}

              <a href="#">Pricing</a>

              <Link to="/auth">Login</Link>

              <Link
                to="/auth"
                className="bg-omni-emerald text-center text-omni-dark px-4 py-2 rounded-lg font-bold"
              >
                Sign Up
              </Link>

            </div>

          </div>

        )}

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

          <h1 className="relative text-3xl md:text-5xl font-extrabold mb-8 leading-[1.1] tracking-tight">

        <TypeAnimation
          sequence={[
            "OmniSight AI",
            2000,
            "Income Protection, Automated by AI.",
            2000,
            "Detecting Risks Before They Happen.",
            2000,
            "Instant Protection for Gig Workers.",
            2000,
          ]}
          wrapper="span"
          speed={40}
          repeat={Infinity}
          className="bg-gradient-to-r from-green-300 via-emerald-400 to-green-600 bg-clip-text text-transparent"
        />

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