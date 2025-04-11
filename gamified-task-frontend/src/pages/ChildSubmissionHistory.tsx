import { useEffect, useState } from 'react';
import API from '../services/api';

interface Submission {
  id: number;
  taskTitle: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  xpEarned: number;
  feedback?: string;
}

const ChildSubmissionHistory = () => {
  const childId = 1; // TEMP: Replace with session user ID
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get(`/submissions/child/${childId}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📁 Submission History</h1>

      {loading ? (
        <p className="text-gray-500">Loading submission history...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500">No submissions found.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white shadow-md rounded-xl p-4 border-l-4 transition-all hover:shadow-lg
              ${
                submission.status === 'approved'
                  ? 'border-green-500'
                  : submission.status === 'rejected'
                  ? 'border-red-500'
                  : 'border-yellow-500'
              }"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{submission.taskTitle}</h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    submission.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : submission.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {submission.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">Submitted on: {new Date(submission.submittedAt).toLocaleString()}</p>
              <p className="text-sm text-indigo-600 mt-1">XP Earned: {submission.xpEarned} XP</p>
              {submission.feedback && (
                <p className="text-sm text-gray-800 mt-2"><strong>Feedback:</strong> {submission.feedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildSubmissionHistory;
