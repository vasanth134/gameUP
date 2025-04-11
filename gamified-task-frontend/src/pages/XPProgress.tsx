import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import API from '../services/api';

interface XPData {
  currentXP: number;
  nextLevelXP: number;
}

interface StatusSummary {
  status: string;
  count: number;
}

const XPProgress = () => {
  const childId = 1; // TEMP: Replace with actual logged-in ID
  const [xpData, setXPData] = useState<XPData>({
    currentXP: 0,
    nextLevelXP: 100,
  });
  const [summary, setSummary] = useState<StatusSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const xpRes = await API.get(`/xp/child/${childId}`);
        const summaryRes = await API.get(`/submissions/child/${childId}/status-summary`);
        setXPData(xpRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error('Error fetching XP/summary data:', err);
      }
    };

    fetchData();
  }, []);

  const progressPercent = Math.min((xpData.currentXP / xpData.nextLevelXP) * 100, 100);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">🎯 XP Dashboard</h1>

      {/* XP Progress Bar */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">XP Progress</h2>
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">Current XP: {xpData.currentXP}</p>
          <p className="text-sm text-gray-600">
            XP required for next level: {xpData.nextLevelXP}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-green-500 h-full text-xs font-bold text-white flex items-center justify-center transition-all"
            style={{ width: `${progressPercent}%` }}
          >
            {Math.floor(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Task Submission Status Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Task Status Summary</h2>
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
