import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { AdminSidebar } from './AdminSidebar';

const AdminDashboard = () => {
  const { user } = useAuthStore();

  const adminTiles = [
    { title: 'Full System Control', desc: 'Configure global settings and site parameters', link: '#', icon: '⚙️' },
    { title: 'User Management', desc: 'Create, edit, or delete staff and client accounts', link: '/admin/users', icon: '🔐' },
    { title: 'Financial Reports', desc: 'Monitor revenue, payments, and invoices', link: '#', icon: '💰' },
  ];

  const operationalTiles = [
    { title: 'Manage Bookings', link: '/admin/bookings', icon: '📅' },
    { title: 'Portfolio & Galleries', link: '/admin/galleries', icon: '📸' },
    { title: 'Blog & Stories', link: '/admin/blog', icon: '✍️' },
    { title: 'Client Inquiries', link: '/admin/inquiries', icon: '✉️' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar role="admin" />
      <main className="ml-64 flex-1 p-8 md:p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white">Admin <span className="text-orange-500">Master Control</span></h1>
          <p className="text-gray-400 mt-2">Administrator: {user?.first_name} {user?.last_name}</p>
        </div>

        {/* Critical System Actions */}
        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-[0.3em] mb-6">Administrative Control</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {adminTiles.map((tile, i) => (
            <Link 
              key={i} 
              to={tile.link}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500 transition-all"
            >
              <div className="text-3xl mb-3">{tile.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{tile.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{tile.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick Operational Access */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">Quick Operations</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalTiles.map((tile, i) => (
            <Link 
              key={i} 
              to={tile.link}
              className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
            >
              <span className="text-2xl">{tile.icon}</span>
              <span className="text-sm font-semibold text-gray-300">{tile.title}</span>
            </Link>
          ))}
        </div>

        {/* Activity Monitor */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">System Activity Monitor</h3>
          <div className="space-y-4">
            {[
              { msg: 'New Staff account created by Admin', time: '2 hours ago', icon: '👤' },
              { msg: 'Revenue report generated for May 2026', time: '5 hours ago', icon: '📊' },
              { msg: 'System backup completed successfully', time: 'Yesterday', icon: '💾' },
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

export default AdminDashboard;