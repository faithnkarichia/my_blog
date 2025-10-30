import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Plus, Users, BarChart } from 'lucide-react';


const AdminDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [articles, setArticles]=useState("")
  const stats = [
    {
      title: 'Total Posts',
      value: '24',
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Published',
      value: '18',
      icon: Eye,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: 'Drafts',
      value: '6',
      icon: FileText,
      color: 'bg-yellow-500',
      change: '+2',
    },
    {
      title: 'Monthly Views',
      value: '12.4K',
      icon: Users,
      color: 'bg-purple-500',
      change: '+18%',
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Getting Started with React 18',
      status: 'published',
      date: '2023-05-15',
      views: 1240,
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS',
      status: 'published',
      date: '2023-04-28',
      views: 890,
    },
    {
      id: 3,
      title: 'Node.js Performance Guide',
      status: 'draft',
      date: '2023-05-20',
      views: 0,
    },
  ];

useEffect(()=>{
// get the articles and display them
  fetch(`${API_URL}/articles`,{
    method:"GET",
    headers:{
      "Content-Type":"application/json"
    },

  })
  .then(res=>res.json())
  .then((articles)=>{
    console.log(articles)
    // i create a function to filter the last three articles
    
  //  we have to loop through the articles and filter based on the last three articles in the db
  const sorted=articles.sort((a,b)=> new Date(b.created_at)- new Date(a.created_at))
  const filtred=sorted.slice(0,3)
  console.log(filtred)
    
setArticles(filtred)
  })
},[])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your content overview.</p>
        </div>
        <Link
          to="/admin/new-post"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Post</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {articles.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-sm text-gray-500">{post.views} views</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/admin/edit-post/${post.id}`}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button className="text-red-600 hover:text-red-800 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <BarChart className="mx-auto mb-4 text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600 text-sm mb-4">View detailed analytics for your posts</p>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            View Analytics
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Users className="mx-auto mb-4 text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Audience</h3>
          <p className="text-gray-600 text-sm mb-4">Understand your readers better</p>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            View Audience
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <FileText className="mx-auto mb-4 text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Content Planning</h3>
          <p className="text-gray-600 text-sm mb-4">Plan your future content</p>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Plan Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;