import { Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../utils/auth';

const Navbar = () => {
  const { pathname } = useLocation();
  const role = localStorage.getItem('role');

  const navItems = [
    { label: '👨‍👩‍👧 Parent Dashboard', path: '/parent-dashboard' },
    { label: '📝 Assign Task', path: '/assign-task' },
    { label: '✅ Review Submissions', path: '/review-submissions' },
    { label: '🎮 Child Dashboard', path: '/child-dashboard' },
    { label: '🔔 Child Notifications', path: '/child-notifications' },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md flex items-center justify-between">
      {/* Left: Nav Links */}
      <div className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1 rounded-lg font-medium hover:bg-gray-700 transition ${
              pathname === item.path ? 'bg-blue-600' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right: Logout Button */}
      {role && (
        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
