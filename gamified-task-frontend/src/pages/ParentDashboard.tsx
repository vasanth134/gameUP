import { useEffect, useState } from 'react';
import API from '../services/api';

interface SubmissionSummary {
  totalXP: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
}

const ParentDashboard = () => {
  const childId = 1; // Replace with dynamic child ID
  const [summary, setSummary] = useState<SubmissionSummary>({
    totalXP: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalPending: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get(`/submissions/child/${childId}/summary`);
        setSummary(res.data);
      } catch (err) {
        console.error('Failed to load summary', err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">👨‍👩‍👧 Parent Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">🏆 Total XP</h2>
          <p className="text-2xl text-green-600 font-bold">{summary.totalXP}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">✅ Approved Tasks</h2>
          <p className="text-2xl text-green-500 font-bold">{summary.totalApproved}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">❌ Rejected Tasks</h2>
          <p className="text-2xl text-red-500 font-bold">{summary.totalRejected}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">🕐 Pending Tasks</h2>
          <p className="text-2xl text-yellow-500 font-bold">{summary.totalPending}</p>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
