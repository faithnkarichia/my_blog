import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Calendar, Tag, ArrowLeft, Clock, User, Heart, MessageCircle, Share, Send } from 'lucide-react';

const ArticleDetail = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyStates, setReplyStates] = useState({});
  const [replyContents, setReplyContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const formatDate = (input) => {
  if (!input) return null;

  const date = new Date(input); // works for ISO strings or timestamps
  if (isNaN(date.getTime())) return null; // invalid date

  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');

  return `${d}/${m}/${y} ${h}:${min}`;
};

 console.log(comments)
  const token=localStorage.getItem("access-token")
  
  const decoded= jwtDecode(token)
  
  const user=decoded.sub.user
  
  const user_id=decoded.sub.id
  const avatar=decoded.sub.avatar

  const [articleLikes, setArticleLikes] = useState(0);
  const [articleLiked, setArticleLiked] = useState(false);

  // Fetch article and comments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articleRes, commentsRes] = await Promise.all([
          fetch(`${API_URL}/article/${id}`),
          fetch(`${API_URL}/comments?article_id=${id}`)
        ]);
        
        if (!articleRes.ok) throw new Error('Failed to fetch article');
        if (!commentsRes.ok) throw new Error('Failed to fetch comments');
        
        const articleData = await articleRes.json();
        const commentsData = await commentsRes.json();
        
        setArticle(articleData);
        setArticleLikes(articleData.likes || 0);
        setArticleLiked(articleData.liked || false);
        setComments(commentsData || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, API_URL]);

  // Handle liking the article
  const handleLikeArticle = () => {
    setArticleLikes(prev => (articleLiked ? prev - 1 : prev + 1));
    setArticleLiked(prev => !prev);
  };

  // Handle liking a comment or reply
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

  // Add a new comment
  const handleAddComment = async e => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;
    if (trimmedComment.length > 1000) {
      alert('Comment is too long. Maximum 1000 characters.');
      return;
    }

    const payload = {
      content: trimmedComment,
      article_id: parseInt(id),
      user: user ,
      user_id: user_id,
      avatar: avatar
    };

    try {
      const res = await fetch(`${API_URL}/post_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access-token') || ''}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        const newCmt = { 
          ...payload, 
          id: data.comment_id, 
          likes: 0, 
          liked: false, 
          replies: [],
          timestamp: new Date().toLocaleDateString()
        };
        setComments(prev => [newCmt, ...prev]);
        setNewComment('');
      } else {
        console.error('Failed to post comment:', data.error);
        alert('Failed to post comment. Please try again.');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Error posting comment. Please try again.');
    }
  };

  // Add a reply to a comment
  const handleAddReply = async (commentId, e) => {
    e.preventDefault();
    const content = replyContents[commentId];
    const trimmedContent = content?.trim();
    if (!trimmedContent) return;
    if (trimmedContent.length > 500) {
      alert('Reply is too long. Maximum 500 characters.');
      return;
    }

    const payload = {
      comment_id: commentId,
      user: user ,
       user_id: user_id,
      avatar:  avatar ,
      content: trimmedContent
    };

    try {
      const res = await fetch(`${API_URL}/post_reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        const reply = { 
          ...payload, 
          id: data.reply_id, 
          likes: 0, 
          liked: false,
          timestamp: new Date().toLocaleDateString()
        };
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId 
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), reply] 
                } 
              : comment
          )
        );
        setReplyContents(prev => ({ ...prev, [commentId]: '' }));
        setReplyStates(prev => ({ ...prev, [commentId]: false }));
      } else {
        console.error('Failed to post reply:', data.error);
        alert('Failed to post reply. Please try again.');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Error posting reply. Please try again.');
    }
  };

  const toggleReply = commentId => {
    if (!user) {
      alert('Please sign in to reply to comments.');
      return;
    }
    setReplyStates(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyChange = (commentId, value) => {
    setReplyContents(prev => ({ ...prev, [commentId]: value }));
  };

  // Comment Component
  const CommentComponent = ({ comment, isReply = false, parentId = null, depth = 0 }) => (
    
    <div className={`${isReply ? 'ml-12 mt-4' : 'border-b border-gray-200 pb-6'} ${depth > 0 ? 'border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex space-x-3">
        <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${comment.isAuthor ? 'text-black font-bold' : 'text-gray-900'}`}>
              {comment.user}
            </span>
            {comment.isAuthor && <span className="bg-black text-white text-xs px-2 py-1 rounded-full">Author</span>}
            <span className="text-gray-500 text-sm">{formatDate(comment.created_at) || formatDate(comment.timestamp) || 'Recently'}</span>
          </div>
          <p className="text-gray-700 mt-2">{comment.content}</p>

          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`flex items-center space-x-1 text-sm transition-colors ${comment.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              <Heart size={16} className={comment.liked ? 'fill-current' : ''} />
              <span>{comment.likes || 0}</span>
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

          {!isReply && replyStates[comment.id] && user && (
            <form onSubmit={(e) => handleAddReply(comment.id, e)} className="mt-4 flex space-x-2">
              <input
                type="text"
                value={replyContents[comment.id] || ''}
                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Send size={16} />
              </button>
            </form>
          )}

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

  if (loading) return <p className="text-center py-10">Loading article...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Error: {error}</p>;
  if (!article) return <p className="text-center py-10">Article not found</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/articles" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Articles
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-4">
            <div className="flex items-center"><Calendar size={16} className="mr-1" /><span>{article.date}</span></div>
            <div className="flex items-center"><Tag size={16} className="mr-1" /><span>{article.category}</span></div>
            <div className="flex items-center"><Clock size={16} className="mr-1" /><span>{article.readTime}</span></div>
            <div className="flex items-center"><User size={16} className="mr-1" /><span>{article.author}</span></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{article.excerpt}</p>

          <div className="h-96 overflow-hidden rounded-lg mb-8">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
            <div className="flex items-center space-x-6">
              <button onClick={handleLikeArticle} className={`flex items-center space-x-2 transition-colors ${articleLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
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

          <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-8">Discussion ({comments.length})</h2>

            {user ? (
              <form onSubmit={handleAddComment} className="mb-12">
                <div className="flex space-x-4">
                  <img src={avatar} alt={user} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-sm ${newComment.length > 1000 ? 'text-red-600' : 'text-gray-500'}`}>
                        {newComment.length}/1000
                      </span>
                      <button 
                        type="submit" 
                        disabled={!newComment.trim() || newComment.length > 1000} 
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
                  <Link to="/login" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Sign in</Link>
                  <Link to="/signup" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">Sign up</Link>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {comments.length > 0 ? comments.map(comment => (
                <CommentComponent key={comment.id} comment={comment} />
              )) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;