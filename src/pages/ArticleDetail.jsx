import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  
  // In a real app, you'd fetch the article data based on the ID
  const article = {
    id: parseInt(id),
    title: "Getting Started with React 18",
    excerpt: "Explore the new features and improvements in the latest version of React.",
    date: "May 15, 2023",
    category: "Frontend",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    content: `
      <p>React 18 brings exciting new features and improvements that enhance the developer experience and application performance.</p>
      
      <h2>New Features</h2>
      <p>One of the most significant additions is concurrent rendering, which allows React to work on multiple tasks simultaneously and interrupt rendering for more important updates.</p>
      
      <h2>Automatic Batching</h2>
      <p>React 18 introduces automatic batching of state updates, reducing unnecessary re-renders and improving performance.</p>
      
      <h2>New APIs</h2>
      <p>The update also includes new APIs like startTransition and useDeferredValue that help manage non-urgent updates more efficiently.</p>
    `
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Articles
        </Link>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar size={16} className="mr-1" />
            <span className="mr-4">{article.date}</span>
            <Tag size={16} className="mr-1" />
            <span>{article.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{article.excerpt}</p>
          <div className="h-96 overflow-hidden rounded-lg">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;