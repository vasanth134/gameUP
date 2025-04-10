import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../services/api';

interface StatusSummary {
  status: string;
  count: number;
}

const XPProgress = () => {
  const childId = 1; // TEMP
  const [summary, setSummary] = useState<StatusSummary[]>([]);

  useEffect(() => {
    const fetchStatusSummary = async () => {
      const res = await API.get(`/submissions/child/${childId}/status-summary`);
      setSummary(res.data);
    };
    fetchStatusSummary();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📈 XP Progress Overview</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Task Status Summary</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default XPProgress;
