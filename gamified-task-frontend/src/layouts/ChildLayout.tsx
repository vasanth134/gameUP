import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: 'dashboard' },
  { name: 'XP Progress', path: 'xp-progress' },
  { name: 'Notifications', path: 'notifications' },
  { name: 'Submissions', path: 'submissions' },
  { name: 'Profile', path: 'profile' },
];

const ChildLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6">🎯 Child Panel</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ChildLayout;
