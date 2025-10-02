import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Clock, User } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  
  // Sample articles data - same as in Articles.jsx
  const articles = [
    {
      id: 1,
      title: "Getting Started with React 18",
      excerpt: "Explore the new features and improvements in the latest version of React.",
      date: "May 15, 2023",
      category: "Frontend",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tags: ["React", "JavaScript", "Frontend"],
      author: "John Doe",
      content: `
        <p class="mb-4">React 18 brings exciting new features and improvements that enhance the developer experience and application performance. This release focuses on providing better performance and user experience through concurrent features.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">Concurrent Rendering</h2>
        <p class="mb-4">One of the most significant additions is concurrent rendering, which allows React to work on multiple tasks simultaneously and interrupt rendering for more important updates. This means your app can stay responsive even during large rendering tasks.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">Automatic Batching</h2>
        <p class="mb-4">React 18 introduces automatic batching of state updates, reducing unnecessary re-renders and improving performance. Multiple state updates within the same event are now batched together automatically.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">New APIs</h2>
        <p class="mb-4">The update also includes new APIs like <code>startTransition</code> and <code>useDeferredValue</code> that help manage non-urgent updates more efficiently, ensuring your app remains responsive.</p>
        
        <p class="mb-4">These features make React 18 a significant step forward in building highly responsive and performant web applications.</p>
      `
    },
    // Add content for other articles similarly...
  ];

  const article = articles.find(a => a.id === parseInt(id)) || articles[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/articles"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Articles
        </Link>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-4">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <Tag size={16} className="mr-1" />
              <span>{article.category}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>{article.author}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{article.excerpt}</p>
          
          <div className="h-96 overflow-hidden rounded-lg mb-8">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
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

      {/* Related Articles Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {articles.filter(a => a.id !== article.id).slice(0, 3).map(relatedArticle => (
              <Link 
                key={relatedArticle.id}
                to={`/article/${relatedArticle.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48">
                  <img 
                    src={relatedArticle.image} 
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{relatedArticle.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedArticle.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;