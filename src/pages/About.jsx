import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <div className="max-w-3xl mx-auto text-gray-700">
          <p className="mb-4">
            Welcome to TechBlog, your go-to resource for the latest in technology, 
            programming, and web development.
          </p>
          <p className="mb-4">
            We're passionate about sharing knowledge and helping developers 
            stay updated with the ever-evolving tech landscape.
          </p>
          <p>
            Our team consists of experienced developers who love to write about 
            their experiences and discoveries in the world of technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;