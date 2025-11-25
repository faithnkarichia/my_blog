import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Eye, Upload, X, Plus } from 'lucide-react';

const NewPost = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image: '',
    status: 'draft'
  });

  // sections: array of { id, title, content }
  const [sections, setSections] = useState([
    { id: Date.now(), title: '', content: '' }
  ]);

  // Featured image / upload states
  const [featuredImage, setFeaturedImage] = useState(null); // local preview URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const [readTime, setReadTime] = useState('0 min read');

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const categories = ['Frontend', 'Backend', 'CSS', 'JavaScript', 'Web Development', 'DevOps'];

  // helpers for sections
  const addSection = () => {
    setSections(prev => [...prev, { id: Date.now() + Math.floor(Math.random()*1000), title: '', content: '' }]);
  };

  const removeSection = (id) => {
    setSections(prev => prev.filter(s => s.id !== id));
    // update readTime after removal
    setTimeout(() => setReadTime(calculateReadTime(post.content, sections.filter(s => s.id !== id))), 0);
  };

  const updateSectionTitle = (id, value) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title: value } : s));
  };

  const updateSectionContent = (id, value) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: value } : s));
    setTimeout(() => setReadTime(calculateReadTime(post.content, sections.map(s => s.id === id ? { ...s, content: value } : s))), 0);
  };

  // Calculate read time based on content + sections
  const calculateReadTime = (mainContent, sectionsArr = []) => {
    const stripHtml = (html = '') => (html || '').replace(/<[^>]*>/g, ' ');
    const mainText = stripHtml(mainContent);
    const sectionsText = sectionsArr.map(s => stripHtml((s.title || '') + ' ' + (s.content || ''))).join(' ');
    const wordCount = (mainText + ' ' + sectionsText).trim().split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil((wordCount || 0) / 200));
    return `${readingTimeMinutes} min read`;
  };

  // keep this function for compatibility (used in EditPost style)
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'blog-posts');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errJson = await response.json().catch(()=>({}));
        throw new Error(errJson.error?.message || 'Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  // New handler mirroring EditPost behaviour: preview + immediate upload + states
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validations
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 8 * 1024 * 1024) { // 8MB limit (matching edit)
      alert('Please choose an image smaller than 8MB');
      return;
    }

    // create preview URL
    const localUrl = URL.createObjectURL(file);
    setFeaturedImage(localUrl);
    setSelectedFile(file);
    setImageError(null);

    // upload immediately
    setIsUploading(true);
    try {
      const secureUrl = await uploadToCloudinary(file);
      setPost(prev => ({ ...prev, image: secureUrl }));
    } catch (err) {
      console.error('Image upload failed:', err);
      const message = (err && err.message) ? err.message : 'Upload failed';
      setImageError(message);
      setPost(prev => ({ ...prev, image: '' }));
    } finally {
      setIsUploading(false);
      // revoke local object URL after a short delay so it remains visible briefly
      setTimeout(() => {
        try { URL.revokeObjectURL(localUrl); } catch (e) {}
      }, 1000);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFeaturedImage('');
    setPost(prev => ({ ...prev, image: '' }));
    setImageError(null);
  };

  const handleMainContentChange = (content) => {
    setPost(prev => ({ ...prev, content }));
    setReadTime(calculateReadTime(content, sections));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // require: title, category, and at least one section or main content
    const hasSections = sections.some(s => (s.title && s.title.trim()) || (s.content && s.content.trim()));
    if (!post.title || !post.category || (!hasSections && !post.content.trim())) {
      alert('Please fill in Title, Category, and at least one section or main content.');
      return;
    }

    const token = localStorage.getItem('access-token');
    if (!token) {
      alert('Please log in to create a post');
      navigate('/login');
      return;
    }

    // prepare sections (send title + content HTML)
    const payloadSections = sections
      .filter(s => (s.title && s.title.trim()) || (s.content && s.content.trim()))
      .map(s => ({ title: s.title || '', content: s.content || '' }));

    // fallback content: if main content empty, build it from sections (keeps compatibility)
    const fallbackContent = post.content && post.content.trim()
      ? post.content
      : payloadSections.map(s => `<h2>${s.title}</h2>${s.content}`).join('');

    const postData = {
      title: post.title,
      excerpt: post.excerpt,
      content: fallbackContent, // fallback combined HTML
      sections: payloadSections, // structured sections
      category: post.category,
      tags: post.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: post.image,
      status: post.status,
      read_time: readTime,
    };

    try {
      console.log('Saving post:', postData);
      const response = await fetch(`${API_URL}/add_article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(()=>({}));
        throw new Error(errorData.message || 'Failed to save post');
      }

      await response.json();
      alert('Post saved successfully!');
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Failed to save post: ${error.message}`);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'blockquote', 'code-block'
  ];

  return (
    <div className="p-8 ">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600">Write and publish your next amazing article</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
            {readTime}
          </div>
          <button
            type="button"
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Eye size={20} />
            <span>Preview</span>
          </button>
          <button
            type="submit"
            form="post-form"
            className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            disabled={isUploading}
          >
            <Save size={20} />
            <span>{isUploading ? 'Uploading...' : 'Save Post'}</span>
          </button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                placeholder="Enter a compelling title..."
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={post.excerpt}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                placeholder="Write a brief description of your post..."
              />
            </div>

            {/* Main Content (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Content (optional — sections preferred)
              </label>
              <ReactQuill
                value={post.content}
                onChange={handleMainContentChange}
                modules={modules}
                formats={formats}
                theme="snow"
                className="bg-white rounded-lg"
                style={{ height: '300px' }}
              />
              <p className="text-sm text-gray-500 mt-2">If you leave this empty, the editor will send the combined sections as content fallback.</p>
            </div>

            {/* Sections editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sections (subtitles + content)</h3>
                <button type="button" onClick={addSection} className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:underline">
                  <Plus size={16} />
                  <span>Add section</span>
                </button>
              </div>

              {sections.map((section, idx) => (
                <div key={section.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                      placeholder={`Section ${idx + 1} title (h2)`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                    <button type="button" onClick={() => removeSection(section.id)} className="ml-3 text-sm text-red-600">
                      Remove
                    </button>
                  </div>

                  <ReactQuill
                    value={section.content}
                    onChange={(value) => updateSectionContent(section.id, value)}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    style={{ minHeight: 140 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Publish</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={post.status}
                    onChange={(e) => setPost({ ...post, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Read Time:</strong> {readTime}
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : (post.status === 'draft' ? 'Save Draft' : 'Publish')}
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Categories *</h3>
              <select
                value={post.category}
                onChange={(e) => setPost({ ...post, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
              <input
                type="text"
                value={post.tags}
                onChange={(e) => setPost({ ...post, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                placeholder="react, javascript, webdev"
              />
              <p className="text-sm text-gray-500 mt-2">Separate tags with commas</p>
            </div>

            {/* Featured Image (updated to match EditPost behavior) */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Featured Image</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="featuredImage"
                  name="featuredImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <label htmlFor="featuredImage" className="cursor-pointer inline-block w-full">
                  <div className="text-gray-400 mb-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7l6 6-6 6M21 7l-6 6 6 6" /></svg>
                  </div>
                  <p className="text-sm text-gray-600">{featuredImage ? 'Change image' : 'Upload featured image'}</p>
                </label>

                {featuredImage && (
                  <div className="mt-4 relative">
                    <img src={featuredImage} alt="preview" className="w-full object-cover max-h-48 rounded" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                      <X size={16} />
                    </button>
                  </div>
                )}

                {isUploading && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}
                {imageError && <p className="text-sm text-red-600 mt-2">Image error: {imageError}</p>}
                {post.image && !featuredImage && (
                  <p className="text-sm text-green-600 mt-2 truncate">✓ Image set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
