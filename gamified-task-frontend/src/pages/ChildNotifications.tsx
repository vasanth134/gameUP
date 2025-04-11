import { useEffect, useState } from 'react';
import API from '../services/api';

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  type: string; // e.g., 'approved', 'rejected', 'general'
}

const ChildNotifications = () => {
  const childId = 1; // TEMP: Replace with actual user/session ID
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get(`/notifications/child/${childId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔔 Notifications</h1>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note) => (
            <li key={note.id} className="bg-white shadow-md p-4 rounded-xl border-l-4
              transition-all hover:shadow-lg
              ${
                note.type === 'approved'
                  ? 'border-green-500'
                  : note.type === 'rejected'
                  ? 'border-red-500'
                  : 'border-blue-500'
              }"
            >
              <p className="font-medium">{note.message}</p>
              <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildNotifications;
