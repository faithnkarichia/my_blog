import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, FileText } from 'lucide-react';

const EditPost = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state - same fields as NewPost
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: '',
    tags: '',
    featuredImage: ''
  });

  // Mock data - replace with actual API call
  const postsData = [
    {
      id: 1,
      title: 'Getting Started with React 18',
      content: 'This is the full content of the React 18 post. It includes all the details about React 18 features and how to get started.',
      excerpt: 'Learn the basics of React 18 and its new features',
      status: 'published',
      category: 'React',
      tags: 'react, javascript, frontend',
      featuredImage: '',
      date: '2023-05-15',
      views: 1240,
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS',
      content: 'Complete guide to mastering Tailwind CSS for modern web development.',
      excerpt: 'Become proficient with Tailwind CSS utilities and components',
      status: 'published',
      category: 'CSS',
      tags: 'tailwind, css, frontend',
      featuredImage: '',
      date: '2023-04-28',
      views: 890,
    },
    {
      id: 3,
      title: 'Node.js Performance Guide',
      content: 'Optimizing Node.js applications for better performance and scalability.',
      excerpt: 'Tips and techniques for Node.js performance optimization',
      status: 'draft',
      category: 'Node.js',
      tags: 'nodejs, backend, performance',
      featuredImage: '',
      date: '2023-05-20',
      views: 0,
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch post data
    const fetchPost = async () => {
      setLoading(true);
      try {
        // In real app: const response = await fetch(`/api/posts/${id}`);
        const postData = postsData.find(p => p.id === parseInt(id));
        
        if (postData) {
          setFormData({
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt,
            status: postData.status,
            category: postData.category,
            tags: postData.tags,
            featuredImage: postData.featuredImage
          });
        } else {
          console.error('Post not found');
          navigate('/admin/posts');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call to update post
      console.log('Updating post:', { id, ...formData });
      
      
      await fetch(`${API_URL}/edit_article/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // Show success message
      alert('Post updated successfully!');
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Implement preview functionality
    console.log('Preview post:', formData);
    alert('Preview functionality would open in a new tab');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading post...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/posts"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Posts</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600">Editing post #{id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={20} />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Update Post'}</span>
          </button>
        </div>
      </div>

      {/* Edit Form - Same structure as NewPost */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Field */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Content Field */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="15"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-vertical"
              placeholder="Write your post content here..."
              required
            />
          </div>

          {/* Excerpt Field */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-vertical"
              placeholder="Brief description of your post..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText size={20} />
              <span>Publish</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="React">React</option>
                  <option value="CSS">CSS</option>
                  <option value="Node.js">Node.js</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="react, javascript, webdev"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Featured Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="featuredImage"
                name="featuredImage"
                onChange={(e) => {
                  // Handle file upload
                  const file = e.target.files[0];
                  if (file) {
                    // In real app, you'd upload the file and get a URL
                    setFormData(prev => ({
                      ...prev,
                      featuredImage: URL.createObjectURL(file)
                    }));
                  }
                }}
                className="hidden"
              />
              <label htmlFor="featuredImage" className="cursor-pointer">
                <div className="text-gray-400 mb-2">
                  <FileText size={32} />
                </div>
                <p className="text-sm text-gray-600">
                  {formData.featuredImage ? 'Change image' : 'Upload featured image'}
                </p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;