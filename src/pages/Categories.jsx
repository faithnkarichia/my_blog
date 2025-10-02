import React from 'react';

const Categories = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Categories</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Explore articles by technology and topic.
        </p>
        {/* Add category-specific content here */}
      </div>
    </div>
  );
};

export default Categories;