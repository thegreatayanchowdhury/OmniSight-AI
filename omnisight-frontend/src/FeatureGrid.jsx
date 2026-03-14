// src/FeatureGrid.jsx
import React from 'react';

const FeatureCard = ({ title, description, iconColor }) => {
  return (
    <div className="bg-omni-dark-card p-8 rounded-3xl shadow-xl border border-gray-800 transition-all hover:border-omni-emerald hover:shadow-omni-emerald/30">
      <div className={`mb-6 p-4 rounded-full inline-block ${iconColor} bg-opacity-20`}>
        {/* ICON PLACEHOLDER */}
        <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

const FeatureGrid = () => {
  return (
    <section className="bg-omni-dark text-gray-100 py-24 z-10 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-white leading-tight">
          How OmniSight <span className='text-omni-emerald'>AI</span> Protects Your Earnings
        </h2>

        {/* The Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          <FeatureCard 
            title="Real-Time Disruption Monitoring"
            description="Our platform continuously analyzes 100+ global and local weather, traffic, and urban data feeds, detecting disruptions across specified city zones."
            iconColor="text-omni-emerald"
          />

          <FeatureCard 
            title="Hyper-Local Premium Modeling"
            description="Premiums are dynamically adjusted based on the historical risk of your selected delivery zone, ensuring low-cost, accurate weekly pricing."
            iconColor="text-omni-emerald"
          />

          <FeatureCard 
            title="AI-Powered Trigger Engine"
            description="If rainfall or route disruptions exceed defined limits, the AI instantly triggers a payout, eliminating any claim processing time."
            iconColor="text-omni-emerald"
          />
          
          <FeatureCard 
            title="Seamless Weekly Payments"
            description="Protection is synchronized with your weekly payout cycle. If a payout is triggered, you receive funds within the same payout period, ensuring consistent income flow."
            iconColor="text-omni-emerald"
          />

          <FeatureCard 
            title="Autonomous Fraud Verification"
            description="Advanced ML models automatically analyze GPS signals and event data to ensure legitimate usage, protecting the integrity of the platform for all users."
            iconColor="text-omni-emerald"
          />
           <FeatureCard 
            title="Regulatory-Ready Compliance"
            description="Built to adapt to evolving regulations. This innovative parametric model can be integrated as a microinsurance product with required approvals."
            iconColor="text-omni-emerald"
          />

        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;