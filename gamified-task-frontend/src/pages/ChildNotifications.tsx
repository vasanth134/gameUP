import { useEffect, useState } from 'react';
import API from '../services/api';

interface Notification {
  id: number;
  message: string;
  created_at: string;
  read: boolean;
}

const ChildNotifications = () => {
  const childId = 1; // Replace with session/user ID
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get(`/notifications/child/${childId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-xl shadow border ${
                notification.read ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <p className="text-sm text-gray-700">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildNotifications;
