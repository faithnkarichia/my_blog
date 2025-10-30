import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, FileText, X } from 'lucide-react';

// EditPost component
// - Fetches article by id
// - Lets user edit fields
// - Uploads a new featured image to Cloudinary (unsigned preset) and uses secure_url
// - PUTs updated article to backend with Authorization header

export default function EditPost() {
  const API_URL = import.meta.env.VITE_API_URL;
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  function stripHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: '',
    tags: '', // comma separated in UI, convert to array if backend expects array
    featuredImage: '' // URL
  });

  // local preview URL for selected file (object URL)
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access-token');
    if (!token) {
      // optional: redirect to login if unauthenticated
      console.warn('No token found in localStorage');
    }

    setLoading(true);
    fetch(`${API_URL}/article/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || 'Failed to fetch article');
        return json;
      })
      .then((article) => {
        setFormData({
          title: article.title || '',
          content: stripHtml(article.content || ''),
          excerpt: article.excerpt || '',
          status: article.status || 'draft',
          category: article.category || '',
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
          featuredImage: article.featuredImage || ''
        });
        setPreviewUrl(article.featuredImage || '');
      })
      .catch((err) => {
        console.error('Error fetching article:', err);
        alert('Failed to load the article. Check console for details.');
      })
      .finally(() => setLoading(false));
  }, [API_URL, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 8 * 1024 * 1024) { // 8MB limit
      alert('Please choose an image smaller than 8MB');
      return;
    }

    // create preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setSelectedFile(file);
    setImageError(null);

    // Option: upload immediately so user sees "uploaded" status before saving
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, featuredImage: uploadedUrl }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setImageError(err.message || 'Upload failed');
      setFormData(prev => ({ ...prev, featuredImage: '' }));
    } finally {
      // revoke after a short delay to ensure browser displayed image (safe to call)
      setTimeout(() => URL.revokeObjectURL(localUrl), 1000);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error('Missing Cloudinary configuration in env (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)');
    }

    setUploadingImage(true);
    setImageError(null);

    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', UPLOAD_PRESET);
      data.append('folder', 'blog-posts');

      const res = await fetch(url, { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) {
        console.error('Cloudinary response error', json);
        throw new Error(json.error?.message || 'Failed to upload image');
      }

      // json.secure_url is the canonical URL to store
      return json.secure_url;
    } catch (err) {
      console.error('uploadImageToCloudinary error', err);
      setImageError(err.message || 'Image upload failed');
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, featuredImage: '' }));
  };

  const handlePreview = () => {
    // You can implement a route that accepts the post data for preview.
    // For now we'll just open a blank window and log to console.
    console.log('Preview post:', formData);
    window.open('/', '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingImage) {
      alert('Still uploading image. Please wait a moment.');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('access-token');

    try {
      
      if (!formData.title || !formData.content || !formData.category) {
        alert('Please fill title, content, and category');
        return;
      }

      // Convert tags string to array if backend expects array
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags,
      };

      const res = await fetch(`${API_URL}/edit_article/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('Update failed', json);
        throw new Error(json.message || 'Update failed');
      }

      alert('Post updated successfully');
      navigate('/admin/posts');
    } catch (err) {
      console.error('Error updating post:', err);
      alert(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/admin/posts" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span>Back to Posts</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600">Editing post #{id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={handlePreview} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Eye size={20} />
            <span>Preview</span>
          </button>

          <button onClick={handleSubmit} disabled={saving || uploadingImage} className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50">
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Update Post'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" placeholder="Enter post title..." required />
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleInputChange} rows={15} className="w-full px-3 py-2 border rounded resize-vertical" placeholder="Write your post content here..." required />
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded" placeholder="Brief description..." />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2"><FileText size={18} /><span>Publish</span></h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded">
                  <option value="">Select a category</option>
                  <option value="React">React</option>
                  <option value="CSS">CSS</option>
                  <option value="Node.js">Node.js</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" placeholder="react, javascript" />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Featured Image</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input type="file" id="featuredImage" name="featuredImage" accept="image/*" onChange={handleFileChange} className="hidden" />

              <label htmlFor="featuredImage" className="cursor-pointer inline-block w-full">
                <div className="text-gray-400 mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7l6 6-6 6M21 7l-6 6 6 6" /></svg>
                </div>
                <p className="text-sm text-gray-600">{previewUrl ? 'Change image' : 'Upload featured image'}</p>
              </label>

              {previewUrl && (
                <div className="mt-4 relative">
                  <img src={previewUrl} alt="preview" className="w-full object-cover max-h-48 rounded" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                    <X size={16} />
                  </button>
                </div>
              )}

              {uploadingImage && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}
              {imageError && <p className="text-sm text-red-600 mt-2">Image error: {imageError}</p>}
              {formData.featuredImage && !previewUrl && (
                <p className="text-sm text-green-600 mt-2 truncate">✓ Image set</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
