import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { label: '👨‍👩‍👧 Parent Dashboard', path: '/parent-dashboard' },
    { label: '📝 Assign Task', path: '/assign-task' },
    { label: '✅ Review Submissions', path: '/review-submissions' },
    { label: '🎮 Child Dashboard', path: '/child-dashboard' },
    { label: '🔔 Child Notifications', path: '/child-notifications' },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
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
    </nav>
  );
};

export default Navbar;
