import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function ClientSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      logout();
    } finally {
      navigate('/'); // Redirect to home page after logout
    }
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 bg-neutral-950 border-r border-white/10 hidden md:block"
      aria-label="Client sidebar"
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="text-sm font-semibold text-white">{user?.first_name || 'Client'}</p>
          <p className="text-xs text-gray-400 mt-1">Account</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/my-bookings"
            className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            My Bookings
          </Link>

          <Link
            to="/profile"
            className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            My Profile
          </Link>

          <Link
            to="/services"
            className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            Book New Session
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
