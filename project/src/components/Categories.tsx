import React from 'react';
import { BookOpen, Code, Heart, Briefcase, Camera, Music, Dumbbell, Wrench } from 'lucide-react';

const Categories = () => {
  const categories = [
    { icon: BookOpen, title: 'Tutoring & Education', description: 'Math, Science, Languages, Test Prep' },
    { icon: Code, title: 'Tech & Programming', description: 'Web Dev, App Development, Code Review' },
    { icon: Briefcase, title: 'Business Consulting', description: 'Strategy, Marketing, Finance Advice' },
    { icon: Heart, title: 'Life Coaching', description: 'Career, Health, Relationship Guidance' },
    { icon: Camera, title: 'Creative Services', description: 'Photography, Design, Content Creation' },
    { icon: Music, title: 'Music & Arts', description: 'Lessons, Practice Sessions, Feedback' },
    { icon: Dumbbell, title: 'Fitness & Wellness', description: 'Personal Training, Yoga, Nutrition' },
    { icon: Wrench, title: 'DIY & Repairs', description: 'Home Improvement, Car Maintenance' },
  ];

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the many ways people are sharing their time and expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline">
            View All Categories →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;