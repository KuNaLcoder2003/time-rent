import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="bg-gray-50 pt-16 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Join thousands earning from their time
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Time Into Value
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Share your skills and expertise on your schedule. Connect with people who need your help 
            and earn money doing what you love, one hour at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg flex items-center">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <PlayCircle className="w-6 h-6 mr-2" />
              Watch How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">10k+</div>
              <div className="text-gray-600 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">50k+</div>
              <div className="text-gray-600 text-sm">Hours Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">$2M+</div>
              <div className="text-gray-600 text-sm">Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">4.9</div>
              <div className="text-gray-600 text-sm">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;