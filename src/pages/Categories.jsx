import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, FolderOpen, FileText, Clock } from 'lucide-react';

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Sample categories with article counts
  const categoriesData = [
    {
      name: 'Frontend',
      count: 8,
      description: 'Modern frontend development with React, Vue, Angular and more',
      color: 'bg-blue-100 text-blue-800',
      articles: [
        {
          id: 1,
          title: "Getting Started with React 18",
          excerpt: "Explore the new features and improvements in the latest version of React.",
          date: "May 15, 2023",
          readTime: "5 min read",
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 5,
          title: "TypeScript Best Practices",
          excerpt: "Explore advanced TypeScript patterns and best practices for robust code.",
          date: "March 22, 2023",
          readTime: "6 min read",
          image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },
    {
      name: 'Backend',
      count: 5,
      description: 'Server-side development, APIs, databases and cloud infrastructure',
      color: 'bg-green-100 text-green-800',
      articles: [
        {
          id: 3,
          title: "Node.js Performance Optimization",
          excerpt: "Discover strategies to improve the performance of your Node.js applications.",
          date: "April 12, 2023",
          readTime: "6 min read",
          image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 8,
          title: "Building RESTful APIs with Express",
          excerpt: "Learn how to design and build robust RESTful APIs using Express.js.",
          date: "February 28, 2023",
          readTime: "8 min read",
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },
    {
      name: 'CSS',
      count: 6,
      description: 'Styling, layouts, animations and modern CSS techniques',
      color: 'bg-purple-100 text-purple-800',
      articles: [
        {
          id: 2,
          title: "Mastering Tailwind CSS",
          excerpt: "Learn advanced techniques and best practices for using Tailwind CSS.",
          date: "April 28, 2023",
          readTime: "7 min read",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 9,
          title: "CSS Grid vs Flexbox",
          excerpt: "Understand when to use CSS Grid and when to use Flexbox.",
          date: "February 20, 2023",
          readTime: "6 min read",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },
    {
      name: 'JavaScript',
      count: 7,
      description: 'Vanilla JavaScript, frameworks, and modern ES6+ features',
      color: 'bg-yellow-100 text-yellow-800',
      articles: [
        {
          id: 7,
          title: "Modern JavaScript ES6+ Features",
          excerpt: "Deep dive into the most useful ES6+ features and syntax.",
          date: "March 8, 2023",
          readTime: "5 min read",
          image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },
    {
      name: 'Web Development',
      count: 4,
      description: 'Full-stack development, tools, and best practices',
      color: 'bg-red-100 text-red-800',
      articles: [
        {
          id: 4,
          title: "Introduction to WebAssembly",
          excerpt: "Learn how WebAssembly can help run high-performance applications.",
          date: "March 30, 2023",
          readTime: "8 min read",
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },
    {
      name: 'DevOps',
      count: 3,
      description: 'Deployment, CI/CD, containers, and infrastructure as code',
      color: 'bg-indigo-100 text-indigo-800',
      articles: [
        {
          id: 6,
          title: "Docker for Development",
          excerpt: "Set up consistent development environments using Docker containers.",
          date: "March 15, 2023",
          readTime: "7 min read",
          image: "https://images.unsplash.com/photo-1625832011226-5ffa8e9e83c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    }
  ];

  // Get all articles for "All" category
  const allArticles = categoriesData.flatMap(category => 
    category.articles.map(article => ({
      ...article,
      category: category.name
    }))
  );

  const displayedArticles = activeCategory === 'All' 
    ? allArticles 
    : categoriesData.find(cat => cat.name === activeCategory)?.articles || [];

  const totalArticles = allArticles.length;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FolderOpen size={32} className="text-gray-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Categories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our technical content organized by topics and technologies. 
            Find exactly what you're looking for.
          </p>
          <div className="mt-4 text-gray-500">
            <FileText size={20} className="inline mr-2" />
            {totalArticles} articles across {categoriesData.length} categories
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* All Categories Card */}
          <div
            className={`bg-white rounded-lg p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              activeCategory === 'All' 
                ? 'border-black shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setActiveCategory('All')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold">All Articles</h3>
                  <p className="text-gray-500 text-sm">Complete collection</p>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {totalArticles}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Browse through all our technical articles and tutorials
            </p>
          </div>

          {/* Category Cards */}
          {categoriesData.map((category, index) => (
            <div
              key={category.name}
              className={`bg-white rounded-lg p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                activeCategory === category.name 
                  ? 'border-black shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                    <Tag size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.count} articles</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                  {category.count}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
            </div>
          ))}
        </div>

        {/* Articles Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {activeCategory === 'All' ? 'All Articles' : activeCategory}
              </h2>
              <p className="text-gray-600 mt-2">
                {displayedArticles.length} article{displayedArticles.length !== 1 ? 's' : ''} 
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </p>
            </div>
            
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                View All Categories
              </button>
            )}
          </div>

          {/* Articles Grid */}
          {displayedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {displayedArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
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
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{article.readTime}</span>
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

                    {/* Category Badge */}
                    {article.category && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          <Tag size={12} className="mr-1" />
                          {article.category}
                        </span>
                      </div>
                    )}

                    {/* Read More */}
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
            /* No Articles State */
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <FileText size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">
                There are no articles in this category yet.
              </p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Browse All Categories
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Content Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{totalArticles}</div>
              <div className="text-gray-600">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{categoriesData.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">2023</div>
              <div className="text-gray-600">Started Writing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;