import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft, Save, Eye, FileText, X, Plus } from 'lucide-react';

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

  const [formData, setFormData] = useState({
    title: '',
    content: '', // main content fallback (HTML)
    excerpt: '',
    status: 'draft',
    category: '',
    tags: '', // UI: comma separated
    featuredImage: '' // URL
  });

  // sections: array of { id, title, content }
  const [sections, setSections] = useState([]);

  // preview and selected file for featured image
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access-token');
    setLoading(true);

    fetch(`${API_URL}/article/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || 'Failed to fetch article');
        return json;
      })
      .then((article) => {
        // populate base fields
        setFormData({
          title: article.title || '',
          content: article.content || '',
          excerpt: article.excerpt || '',
          status: article.status || 'draft',
          category: article.category || '',
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
          featuredImage: article.image || article.featuredImage || ''
        });
        setPreviewUrl(article.image || article.featuredImage || '');

        // prefer structured sections when available
        if (Array.isArray(article.sections) && article.sections.length > 0) {
          const normalized = article.sections.map((s, idx) => ({ id: s.id || `s-${idx}`, title: s.title || '', content: s.content || '' }));
          setSections(normalized);
        } else if (article.content) {
          // parse existing HTML content into sections using <h2> boundaries
          const parsed = parseHTMLToSections(article.content);
          if (parsed.length) setSections(parsed);
          else setSections([{ id: Date.now(), title: '', content: article.content || '' }]);
        } else {
          setSections([{ id: Date.now(), title: '', content: '' }]);
        }
      })
      .catch((err) => {
        console.error('Error fetching article:', err);
        alert('Failed to load the article. Check console for details.');
      })
      .finally(() => setLoading(false));

  }, [API_URL, id]);

  // parse HTML into sections split at h2 tags
  function parseHTMLToSections(html) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nodes = Array.from(doc.body.childNodes);
      const sectionsOut = [];

      let current = { id: Date.now(), title: '', content: '' };

      nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'h2') {
          // push previous section if it has content
          if ((current.title && current.title.trim()) || (current.content && current.content.trim())) {
            sectionsOut.push(current);
          }
          current = { id: Date.now() + Math.random(), title: node.innerHTML || node.textContent || '', content: '' };
        } else {
          // append node's outerHTML or text
          const wrapper = document.createElement('div');
          wrapper.appendChild(node.cloneNode(true));
          current.content += wrapper.innerHTML || '';
        }
      });

      // push last
      if ((current.title && current.title.trim()) || (current.content && current.content.trim())) {
        sectionsOut.push(current);
      }

      return sectionsOut;
    } catch (err) {
      console.error('parseHTMLToSections error', err);
      return [];
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // sections helpers
  const addSection = () => setSections(prev => [...prev, { id: Date.now() + Math.random(), title: '', content: '' }]);
  const removeSection = (id) => setSections(prev => prev.filter(s => s.id !== id));
  const updateSectionTitle = (id, value) => setSections(prev => prev.map(s => s.id === id ? { ...s, title: value } : s));
  const updateSectionContent = (id, value) => setSections(prev => prev.map(s => s.id === id ? { ...s, content: value } : s));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 8 * 1024 * 1024) { alert('Please choose an image smaller than 8MB'); return; }

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setSelectedFile(file);
    setImageError(null);

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (uploadedUrl) setFormData(prev => ({ ...prev, featuredImage: uploadedUrl }));
    } catch (err) {
      console.error('Image upload failed:', err);
      setImageError(err.message || 'Upload failed');
      setFormData(prev => ({ ...prev, featuredImage: '' }));
    } finally {
      setTimeout(() => URL.revokeObjectURL(localUrl), 1000);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;
    if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Missing Cloudinary config');

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
      if (!res.ok) throw new Error(json.error?.message || 'Failed to upload image');
      return json.secure_url;
    } catch (err) {
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
    console.log('Preview post:', { ...formData, sections });
    window.open('/', '_blank');
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'blockquote', 'code-block'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingImage) { alert('Still uploading image. Please wait.'); return; }

    setSaving(true);
    const token = localStorage.getItem('access-token');

    try {
      // require minimal fields
      if (!formData.title || !formData.category) { alert('Please fill title and category'); setSaving(false); return; }

      const payloadSections = sections
        .filter(s => (s.title && s.title.trim()) || (s.content && s.content.trim()))
        .map(s => ({ title: s.title || '', content: s.content || '' }));

      const fallbackContent = formData.content && formData.content.trim()
        ? formData.content
        : payloadSections.map(s => `<h2>${s.title}</h2>${s.content}`).join('');

      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: fallbackContent,
        sections: payloadSections,
        category: formData.category,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags,
        image: formData.featuredImage || '',
        status: formData.status
      };

      const res = await fetch(`${API_URL}/edit_article/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Update failed');

      alert('Post updated successfully');
      navigate('/admin/posts');
    } catch (err) {
      console.error('Error updating post:', err);
      alert(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading post...</div>
      </div>
    </div>
  );

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
            <Eye size={20} /><span>Preview</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Content (optional — sections preferred)</label>
            <ReactQuill value={formData.content} onChange={(val) => setFormData(prev => ({ ...prev, content: val }))} modules={modules} formats={formats} theme="snow" style={{ minHeight: 200 }} />
            <p className="text-sm text-gray-500 mt-2">If you leave this empty, the editor will send the combined sections as content fallback.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sections (subtitles + content)</h3>
              <button type="button" onClick={addSection} className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:underline">
                <Plus size={16} /><span>Add section</span>
              </button>
            </div>

            {sections.map((section, idx) => (
              <div key={section.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <input type="text" value={section.title} onChange={(e) => updateSectionTitle(section.id, e.target.value)} placeholder={`Section ${idx+1} title (h2)`} className="flex-1 px-3 py-2 border rounded" />
                  <button type="button" onClick={() => removeSection(section.id)} className="ml-3 text-sm text-red-600">Remove</button>
                </div>

                <ReactQuill value={section.content} onChange={(val) => updateSectionContent(section.id, val)} modules={modules} formats={formats} theme="snow" style={{ minHeight: 140 }} />
              </div>
            ))}
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
