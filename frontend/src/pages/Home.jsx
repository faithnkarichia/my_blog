import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const Home = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with React 18",
      excerpt: "Explore the new features and improvements in the latest version of React.",
      date: "May 15, 2023",
      category: "Frontend",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Mastering Tailwind CSS",
      excerpt: "Learn advanced techniques and best practices for using Tailwind CSS in production.",
      date: "April 28, 2023",
      category: "CSS",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "Node.js Performance Optimization",
      excerpt: "Discover strategies to improve the performance of your Node.js applications.",
      date: "April 12, 2023",
      category: "Backend",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const categories = ["All", "Frontend", "Backend", "DevOps", "CSS", "JavaScript", "Web Development"];

  // Add this inside the Home component, before the return statement
const categoriesData = [
  { name: 'Frontend', count: 8, color: 'bg-blue-100 text-blue-800' },
  { name: 'Backend', count: 5, color: 'bg-green-100 text-green-800' },
  { name: 'CSS', count: 6, color: 'bg-purple-100 text-purple-800' },
  { name: 'JavaScript', count: 7, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Web Development', count: 4, color: 'bg-red-100 text-red-800' },
  { name: 'DevOps', count: 3, color: 'bg-indigo-100 text-indigo-800' },
];

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Tech Insights & Tutorials</h1>
          <p className="text-xl text-gray-200 mb-8">Exploring the latest in web development, programming, and technology trends.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/articles"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
            >
              Read Latest Articles
            </Link>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Handpicked selection of our most popular and insightful technical articles.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={16} className="mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <Tag size={16} className="mr-1" />
                    <span>{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <Link 
                      to={`/article/${post.id}`}
                      className="flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors"
                    >
                      Read More <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/articles"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

    {/* Categories Section */}
<section className="py-16">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Find articles organized by technology and topic. Click to explore specific categories.
      </p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {categoriesData.map((category, index) => (
        <Link
          key={category.name}
          to="/categories"
          className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
        >
          <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
            <Tag size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.count} articles</p>
        </Link>
      ))}
    </div>
    
    <div className="text-center">
      <Link 
        to="/categories"
        className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        View All Categories
        <ArrowRight size={16} className="ml-2" />
      </Link>
    </div>
  </div>
</section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">Subscribe to our newsletter and never miss the latest tech insights and tutorials.</p>
          
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-r-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;