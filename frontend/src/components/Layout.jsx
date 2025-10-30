import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X,User } from 'lucide-react';
import {jwtDecode} from "jwt-decode"
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // adjust this depending on your token structure
        const userData = decoded.sub;
        setUser(userData);
      } catch (err) {
        console.error("Error decoding token:", err);
        localStorage.removeItem("access-token"); // if invalid
      }
    }
  }, []);


  
  
  


const handleLogout = () => {
  localStorage.removeItem('access-token');
  setUser(null);
  window.location.href = '/';
};
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full"></div>
            <span className="text-xl font-bold">TechVerse</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="font-medium hover:text-gray-600 transition-colors">Home</Link>
            <Link to="/articles" className="font-medium hover:text-gray-600 transition-colors">Articles</Link>
            <Link to="/categories" className="font-medium hover:text-gray-600 transition-colors">Categories</Link>
            <Link to="/about" className="font-medium hover:text-gray-600 transition-colors">About</Link>
            <Link to="/contact" className="font-medium hover:text-gray-600 transition-colors">Contact</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
          
<div className="flex items-center space-x-4">
  
  
  {user ? (
    <div className="relative group">
      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
        {user.avatar ? (
  <img
    src={user.avatar}
    alt="User avatar"
    className="w-8 h-8 rounded-full"
  />
) : (
  <User className="w-8 h-8 text-gray-600" />
)}
        <span className="hidden md:block text-sm font-medium">{user.user}</span>
      </button>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Profile
          </Link>
          <Link to="/bookmarks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Saved Articles
          </Link>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <Link
        to="/login"
        className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
      >
        Sign in
      </Link>
      <span className="text-gray-300">|</span>
      <Link
        to="/signup"
        className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Sign up
      </Link>
    </div>
  )}
  
  <button 
    className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
  </button>
</div>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <Link to="/" className="font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/articles" className="font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Articles</Link>
              <Link to="/categories" className="font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link to="/about" className="font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" className="font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full"></div>
                <span className="text-xl font-bold">TechVerse</span>
              </div>
              <p className="text-gray-400">Sharing knowledge and insights about technology and programming.</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/articles" className="hover:text-white transition-colors">Articles</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Frontend</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Backend</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DevOps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CSS</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TechVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;