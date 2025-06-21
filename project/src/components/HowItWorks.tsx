import React from 'react';
import { UserPlus, Calendar, Users, DollarSign } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your profile and showcase your skills, experience, and availability.',
      color: 'blue',
    },
    {
      icon: Calendar,
      title: 'List Your Time',
      description: 'Set your schedule, hourly rate, and the services you want to offer.',
      color: 'green',
    },
    {
      icon: Users,
      title: 'Get Booked',
      description: 'Connect with people who need your expertise and schedule sessions.',
      color: 'blue',
    },
    {
      icon: DollarSign,
      title: 'Earn Money',
      description: 'Complete sessions, get paid instantly, and build your reputation.',
      color: 'green',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start earning from your time in just four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${step.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-8 h-8 ${step.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-8">
                      <div className="absolute right-0 top-1/2 w-2 h-2 bg-gray-300 rounded-full -translate-y-1/2"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;