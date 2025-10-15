import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Clock, User, Heart, MessageCircle, Share, Send } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  
  // Get user from localStorage (if logged in)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      content: 'Great article! The section about concurrent rendering was particularly helpful for my current project.',
      timestamp: '2 hours ago',
      likes: 8,
      liked: false,
      replies: [
        {
          id: 11,
          user: 'Mike Chen (Author)',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
          content: 'Thanks Sarah! Glad you found it helpful. Concurrent rendering is definitely a game-changer.',
          timestamp: '1 hour ago',
          likes: 3,
          liked: false,
          isAuthor: true
        }
      ]
    },
    {
      id: 2,
      user: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      content: 'Would love to see more examples of automatic batching in different scenarios.',
      timestamp: '4 hours ago',
      likes: 5,
      liked: true,
      replies: [
        {
          id: 21,
          user: 'Emma Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
          content: 'I second that! More practical examples would be awesome.',
          timestamp: '3 hours ago',
          likes: 2,
          liked: false
        }
      ]
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyStates, setReplyStates] = useState({});
  const [replyContents, setReplyContents] = useState({});

  // Sample article data
  const articles = [
    {
      id: 1,
      title: "Getting Started with React 18",
      excerpt: "Explore the new features and improvements in the latest version of React.",
      date: "May 15, 2023",
      category: "Frontend",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Mike Chen",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content: `
        <p class="mb-4">React 18 brings exciting new features and improvements that enhance the developer experience and application performance. This release focuses on providing better performance and user experience through concurrent features.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">Concurrent Rendering</h2>
        <p class="mb-4">One of the most significant additions is concurrent rendering, which allows React to work on multiple tasks simultaneously and interrupt rendering for more important updates. This means your app can stay responsive even during large rendering tasks.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">Automatic Batching</h2>
        <p class="mb-4">React 18 introduces automatic batching of state updates, reducing unnecessary re-renders and improving performance. Multiple state updates within the same event are now batched together automatically.</p>
        
        <h2 class="text-2xl font-bold mt-8 mb-4">New APIs</h2>
        <p class="mb-4">The update also includes new APIs like <code>startTransition</code> and <code>useDeferredValue</code> that help manage non-urgent updates more efficiently, ensuring your app remains responsive.</p>
        
        <p class="mb-4">These features make React 18 a significant step forward in building highly responsive and performant web applications.</p>
      `,
      likes: 42,
      liked: false
    }
  ];

  const article = articles.find(a => a.id === parseInt(id)) || articles[0];
  const [articleLikes, setArticleLikes] = useState(article.likes);
  const [articleLiked, setArticleLiked] = useState(article.liked);

  const handleLikeArticle = () => {
    setArticleLikes(prev => articleLiked ? prev - 1 : prev + 1);
    setArticleLiked(!articleLiked);
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    setComments(prev => {
      if (isReply && parentId) {
        return prev.map(comment => 
          comment.id === parentId 
            ? {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? { ...reply, likes: reply.liked ? reply.likes - 1 : reply.likes + 1, liked: !reply.liked }
                    : reply
                )
              }
            : comment
        );
      } else {
        return prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.liked ? comment.likes - 1 : comment.likes + 1, liked: !comment.liked }
            : comment
        );
      }
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: user ? user.name : 'Current User',
      avatar: user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleAddReply = (commentId, e) => {
    e.preventDefault();
    const replyContent = replyContents[commentId];
    if (!replyContent?.trim()) return;

    const reply = {
      id: Date.now(),
      user: user ? user.name : 'Current User',
      avatar: user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      content: replyContent,
      timestamp: 'Just now',
      likes: 0,
      liked: false
    };

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyContents(prev => ({ ...prev, [commentId]: '' }));
    setReplyStates(prev => ({ ...prev, [commentId]: false }));
  };

  const toggleReply = (commentId) => {
    if (!user) {
      // If user is not logged in, we could show a login prompt here
      return;
    }
    setReplyStates(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleReplyChange = (commentId, value) => {
    setReplyContents(prev => ({
      ...prev,
      [commentId]: value
    }));
  };

  const CommentComponent = ({ comment, isReply = false, parentId = null, depth = 0 }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : 'border-b border-gray-200 pb-6'} ${depth > 0 ? 'border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex space-x-3">
        <img
          src={comment.avatar}
          alt={comment.user}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${comment.isAuthor ? 'text-black font-bold' : 'text-gray-900'}`}>
              {comment.user}
            </span>
            {comment.isAuthor && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full">Author</span>
            )}
            <span className="text-gray-500 text-sm">{comment.timestamp}</span>
          </div>
          <p className="text-gray-700 mt-2">{comment.content}</p>
          
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart size={16} className={comment.liked ? 'fill-current' : ''} />
              <span>{comment.likes}</span>
            </button>
            
            {!isReply && depth < 2 && (
              <button
                onClick={() => toggleReply(comment.id)}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <MessageCircle size={16} />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {!isReply && replyStates[comment.id] && user && (
            <form 
              onSubmit={(e) => handleAddReply(comment.id, e)}
              className="mt-4 flex space-x-2"
            >
              <input
                type="text"
                value={replyContents[comment.id] || ''}
                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentComponent 
                  key={reply.id} 
                  comment={reply} 
                  isReply={true} 
                  parentId={comment.id}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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

          {/* Article Actions */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLikeArticle}
                className={`flex items-center space-x-2 transition-colors ${
                  articleLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Heart size={24} className={articleLiked ? 'fill-current' : ''} />
                <span className="font-medium">{articleLikes} likes</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <MessageCircle size={24} />
                <span className="font-medium">{comments.length} comments</span>
              </button>
            </div>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-8">
              Discussion ({comments.length})
            </h2>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-12">
                <div className="flex space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center mb-12">
                <User size={32} className="mx-auto mb-3 text-gray-400" />
                <h3 className="font-medium text-gray-900 mb-2">Join the conversation</h3>
                <p className="text-gray-600 mb-4">Sign in to share your thoughts and connect with other readers</p>
                <div className="flex justify-center space-x-3">
                  <Link
                    to="/login"
                    className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Related articles would go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;