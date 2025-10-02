import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Articles from './pages/Articles.jsx';
import Categories from './pages/Categories.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Posts from './pages/admin/Posts.jsx';
import NewPost from './pages/admin/NewPost.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/article/:id" element={<ArticleDetail />} />

                  {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/posts" element={<AdminLayout><Posts /></AdminLayout>} />
        <Route path="/admin/new-post" element={<AdminLayout><NewPost /></AdminLayout>} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;