import { useEffect, useState } from 'react';
import API from '../services/api';

interface Submission {
  id: number;
  task_title: string;
  submitted_at: string;
  status: string;
}

const ReviewSubmissions = () => {
  const childId = 1; // TEMP: replace with context/session later
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const fetchSubmissions = async () => {
    try {
      const res = await API.get(`/submissions/child/${childId}/pending`);
      setSubmissions(res.data);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    }
  };

  const updateStatus = async (submissionId: number, newStatus: 'approved' | 'rejected') => {
    try {
      await API.put(`/submissions/${submissionId}/status`, { status: newStatus });
      fetchSubmissions(); // Refresh the list
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📋 Review Submissions</h1>

      {submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((submission) => (
            <li key={submission.id} className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">{submission.task_title}</h3>
              <p className="text-sm text-gray-500">Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => updateStatus(submission.id, 'approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(submission.id, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewSubmissions;
