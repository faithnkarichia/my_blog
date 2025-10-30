import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Settings, Plus, LogOut, Home, BarChart } from 'lucide-react';

const AdminLayout = ({ children, onLogout }) => {
  const menuItems = [
    { path: '/admin', icon: BarChart, label: 'Dashboard' },
    { path: '/admin/posts', icon: FileText, label: 'All Posts' },
    { path: '/admin/new-post', icon: Plus, label: 'New Post' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between h-screen">
        <div>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex-shrink-0" aria-hidden />
              <div>
                <span className="text-xl font-bold">TechBlog</span>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${{
                          true: 'bg-black text-white',
                          false: 'text-gray-700 hover:bg-gray-100',
                        }[isActive]}`
                      }
                    >
                      <Icon size={20} aria-hidden />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <NavLink
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home size={16} aria-hidden />
              <span>View Site</span>
            </NavLink>

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              aria-label="Logout"
            >
              <LogOut size={16} aria-hidden />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
