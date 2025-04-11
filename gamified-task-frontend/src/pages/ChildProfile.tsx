import { useEffect, useState } from 'react';
import API from '../services/api';

interface ChildInfo {
  id: number;
  name: string;
  age: number;
  grade: string;
}

interface XPInfo {
  totalXP: number;
}

interface SubmissionStatus {
  status: string;
  count: number;
}

const ChildProfile = () => {
  const childId = 1; // Replace with actual logged-in child ID from session
  const [child, setChild] = useState<ChildInfo | null>(null);
  const [xpInfo, setXPInfo] = useState<XPInfo | null>(null);
  const [submissionSummary, setSubmissionSummary] = useState<SubmissionStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const res = await API.get(`/children/${childId}`);
        setChild(res.data);
      } catch (err) {
        console.error('Failed to load child info', err);
      }
    };

    const fetchXP = async () => {
      try {
        const res = await API.get(`/submissions/child/${childId}/summary`);
        setXPInfo({ totalXP: res.data.totalXP });
      } catch (err) {
        console.error('Failed to fetch XP info', err);
      }
    };

    const fetchStatusSummary = async () => {
      try {
        const res = await API.get(`/submissions/child/${childId}/status-summary`);
        setSubmissionSummary(res.data);
      } catch (err) {
        console.error('Failed to fetch task status summary', err);
      }
    };

    const loadAllData = async () => {
      await Promise.all([fetchChildDetails(), fetchXP(), fetchStatusSummary()]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👧 Child Profile</h1>

      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : (
        <>
          {/* Personal Info */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">👤 Personal Information</h2>
            {child ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {child.name}</p>
                <p><strong>Age:</strong> {child.age}</p>
                <p><strong>Grade:</strong> {child.grade}</p>
              </div>
            ) : (
              <p className="text-sm text-red-500">Child info not found.</p>
            )}
          </div>

          {/* XP Info */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🏆 Total XP</h2>
            <p className="text-2xl font-bold text-indigo-600">
              {xpInfo?.totalXP ?? 0} XP
            </p>
          </div>

          {/* Submission Status */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Task Submission Summary</h2>
            {submissionSummary.length > 0 ? (
              <ul className="space-y-2">
                {submissionSummary.map((status) => (
                  <li key={status.status} className="text-sm text-gray-700">
                    <strong>{status.status}:</strong> {status.count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No submission data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChildProfile;
