import { useEffect, useState } from 'react';
import API from '../services/api';

interface Notification {
  id: number;
  message: string;
  created_at: string;
}

const Notifications = () => {
  const childId = 1; // TEMP: Replace with user context later
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await API.get(`/notifications/child/${childId}`);
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔔 Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500"
          >
            <p className="text-gray-800">{notif.message}</p>
            <p className="text-xs text-gray-500">{new Date(notif.created_at).toLocaleString()}</p>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-500 text-sm">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
