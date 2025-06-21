import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTA = () => {
  const benefits = [
    'Set your own rates and schedule',
    'No long-term commitments',
    'Instant payments after each session',
    'Build your professional reputation',
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Earning from Your Time?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our growing community of professionals who are turning their expertise into income
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-white">
                <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center">
              Start Earning Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
              Learn More
            </button>
          </div>

          <p className="text-blue-100 text-sm mt-6">
            Free to join • No setup fees • Start earning immediately
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;