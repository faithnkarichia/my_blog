import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, Search, Filter } from 'lucide-react';

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Sample articles data - you can expand this
  const allArticles = [
    {
      id: 1,
      title: "Getting Started with React 18",
      excerpt: "Explore the new features and improvements in the latest version of React including concurrent rendering, automatic batching, and new APIs.",
      date: "May 15, 2023",
      category: "Frontend",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["React", "JavaScript", "Frontend"]
    },
    {
      id: 2,
      title: "Mastering Tailwind CSS",
      excerpt: "Learn advanced techniques and best practices for using Tailwind CSS in production applications with custom configurations and plugins.",
      date: "April 28, 2023",
      category: "CSS",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["Tailwind", "CSS", "Design"]
    },
    {
      id: 3,
      title: "Node.js Performance Optimization",
      excerpt: "Discover strategies to improve the performance of your Node.js applications through clustering, caching, and database optimization.",
      date: "April 12, 2023",
      category: "Backend",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["Node.js", "Performance", "Backend"]
    },
    {
      id: 4,
      title: "Introduction to WebAssembly",
      excerpt: "Learn how WebAssembly can help you run high-performance applications in the browser and bridge the gap between web and native apps.",
      date: "March 30, 2023",
      category: "Web Development",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["WebAssembly", "Performance", "Web"]
    },
    {
      id: 5,
      title: "TypeScript Best Practices",
      excerpt: "Explore advanced TypeScript patterns and best practices that will make your code more robust and maintainable.",
      date: "March 22, 2023",
      category: "Frontend",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["TypeScript", "JavaScript", "Best Practices"]
    },
    {
      id: 6,
      title: "Docker for Development",
      excerpt: "Set up consistent development environments using Docker containers and learn how to streamline your development workflow.",
      date: "March 15, 2023",
      category: "DevOps",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1625832011226-5ffa8e9e83c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["Docker", "DevOps", "Containers"]
    },
    {
      id: 7,
      title: "Modern JavaScript ES6+ Features",
      excerpt: "Deep dive into the most useful ES6+ features including destructuring, spread operator, promises, and async/await.",
      date: "March 8, 2023",
      category: "JavaScript",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["JavaScript", "ES6", "Modern JS"]
    },
    {
      id: 8,
      title: "Building RESTful APIs with Express",
      excerpt: "Learn how to design and build robust RESTful APIs using Express.js with proper error handling and authentication.",
      date: "February 28, 2023",
      category: "Backend",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["Express", "API", "Backend"]
    },
    {
      id: 9,
      title: "CSS Grid vs Flexbox",
      excerpt: "Understand when to use CSS Grid and when to use Flexbox with practical examples and real-world use cases.",
      date: "February 20, 2023",
      category: "CSS",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["CSS", "Grid", "Flexbox"]
    }
  ];

  // Get unique categories
  const categories = ['All', ...new Set(allArticles.map(article => article.category))];

  // Filter articles based on search and category
  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Articles</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Browse through our complete collection of technical articles, tutorials, and insights.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Filter size={20} className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Showing {filteredArticles.length} of {allArticles.length} articles
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredArticles.map(article => (
              <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                {/* Article Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                
                {/* Article Content */}
                <div className="p-6">
                  {/* Category and Date */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Tag size={14} className="mr-1" />
                      <span className="font-medium">{article.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-gray-700 transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More and Read Time */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <Link 
                      to={`/article/${article.id}`}
                      className="flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors group"
                    >
                      Read More 
                      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filter criteria.
              </p>
            </div>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredArticles.length > 0 && (
          <div className="text-center">
            <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;