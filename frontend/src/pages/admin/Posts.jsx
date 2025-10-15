import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Edit, Trash2, Eye, Plus } from 'lucide-react';

const Posts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const posts = [
    {
      id: 1,
      title: 'Getting Started with React 18',
      status: 'published',
      category: 'Frontend',
      date: '2023-05-15',
      views: 1240,
      comments: 12,
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS',
      status: 'published',
      category: 'CSS',
      date: '2023-04-28',
      views: 890,
      comments: 8,
    },
    {
      id: 3,
      title: 'Node.js Performance Guide',
      status: 'draft',
      category: 'Backend',
      date: '2023-05-20',
      views: 0,
      comments: 0,
    },
    {
      id: 4,
      title: 'TypeScript Best Practices',
      status: 'published',
      category: 'Frontend',
      date: '2023-03-22',
      views: 1560,
      comments: 15,
    },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="text-gray-600">Manage your blog posts and content</p>
        </div>
        <Link
          to="/admin/new-post"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Post</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter size={20} className="text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredPosts.length} Post{filteredPosts.length !== 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{post.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {post.views}
                      </span>
                      <span>•</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/admin/edit-post/${post.id}`}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      <Link
                        to={`/article/${post.id}`}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                      <button className="text-red-600 hover:text-red-900 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;