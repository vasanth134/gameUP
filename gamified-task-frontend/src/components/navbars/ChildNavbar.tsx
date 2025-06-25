import { Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../../utils/auth'; 

const ChildNavbar = () => {
  const { pathname } = useLocation();
  const role = localStorage.getItem('role');

  const navItems = [
    { label: '📋 Dashboard', path: '/child/dashboard' },
    { label: '📈 XP Progress', path: '/child/xp-progress' },
    { label: '📨 Notifications', path: '/child/notifications' },
    { label: '📜 Submission History', path: '/child/submissions' },
    { label: '👤 Profile', path: '/child/profile' },
  ];

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <div className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1 rounded-lg font-medium hover:bg-gray-700 transition ${
              pathname === item.path ? 'bg-green-600' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

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

export default ChildNavbar;
