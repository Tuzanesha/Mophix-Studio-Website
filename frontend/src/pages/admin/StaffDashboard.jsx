import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { AdminSidebar, staffNavItems } from './AdminSidebar';

const StaffDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const managementTiles = [
    { title: 'Manage Bookings', desc: 'Confirm/Reject requests & update status', link: '/admin/bookings', icon: '📅' },
    { title: 'Deliver Photos', desc: 'Send final images or ZIP files to clients', link: '/admin/bookings', icon: '📤' },
    { title: 'Photography Portfolio', desc: 'Upload, edit, and categorize photos', link: '/admin/galleries', icon: '📸' },
    { title: 'Client Information', desc: 'Communicate and track client sessions', link: '/admin/users', icon: '👥' },
    { title: 'Manage Testimonials', desc: 'Approve or delete client reviews', link: '/admin/testimonials', icon: '⭐' },
    { title: 'Contact Messages', desc: 'Reply to inquiries and resolve messages', link: '/admin/inquiries', icon: '✉️' },
    { title: 'Blog & Stories', desc: 'Create and publish photography stories', link: '/admin/blog', icon: '✍️' },
  ];

  const quickTools = [
    { title: 'View Services', link: '/services', icon: '💼' },
    { title: 'My Profile', link: '/profile', icon: '👤' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar role="staff" navItems={staffNavItems} />
      <main className="ml-64 flex-1 p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white">Staff <span className="text-orange-500">Operations</span></h1>
            <p className="text-gray-400 mt-2">Team Member: {user?.first_name} {user?.last_name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 text-gray-300 hover:text-red-400 px-6 py-3 rounded-xl transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout to Home
          </button>
        </div>

        {/* Main Management Section */}
        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-[0.3em] mb-6">Management Control</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {managementTiles.map((tile, i) => (
            <Link 
              key={i} 
              to={tile.link}
              className="group bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 rounded-2xl hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{tile.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{tile.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tile.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick Tools Section */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link 
            to="/services"
            className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
          >
            <span className="text-2xl">💼</span>
            <span className="text-sm font-semibold text-gray-300">View Services</span>
          </Link>
          <Link 
            to="/profile"
            className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
          >
            <span className="text-2xl">👤</span>
            <span className="text-sm font-semibold text-gray-300">My Profile</span>
          </Link>
          <Link 
            to="/admin/bookings"
            className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
          >
            <span className="text-2xl">📤</span>
            <span className="text-sm font-semibold text-gray-300">Deliver Photos</span>
          </Link>
          {/* Add more quick tools if needed, e.g., a link to create a new blog post directly */}
          <Link 
            to="/admin/blog" // Link to the admin blog page for creating posts
            className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
          >
            <span className="text-2xl">✍️</span>
            <span className="text-sm font-semibold text-gray-300">Create Blog Post</span>
          </Link>
          {/* {quickTools.map((tile, i) => (
            <Link 
              key={i} 
              to={tile.link}
              className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
            >
              <span className="text-2xl">{tile.icon}</span>
              <span className="text-sm font-semibold text-gray-300">{tile.title}</span>
            </Link>
          ))} */}
        </div>

        {/* Staff Activity Monitor */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6">Operational Activity Monitor</h3>
          <div className="space-y-4">
            {[
              { msg: 'New wedding gallery uploaded', time: '45 mins ago', icon: '📸' },
              { msg: 'Booking request #1024 confirmed', time: '3 hours ago', icon: '📅' },
              { msg: 'Final photos delivered to client Jane Smith', time: '5 hours ago', icon: '📤' },
              { msg: 'Responded to inquiry from Amara Osei', time: 'Yesterday', icon: '✉️' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-xl">{log.icon}</span>
                  <span className="text-sm text-gray-300">{log.msg}</span>
                </div>
                <span className="text-xs text-gray-600">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;