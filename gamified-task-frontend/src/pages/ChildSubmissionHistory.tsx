import { useEffect, useState } from 'react';
import API from '../services/api';

interface Submission {
  id: number;
  task: {
    title: string;
    xp: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

const ChildSubmissionHistory = () => {
  const childId = 1; // Replace with dynamic child ID
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get(`/submissions/child/${childId}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submission history', err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📜 Submission History</h1>
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <p className="text-gray-600">No submissions yet.</p>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} className="p-4 rounded-xl shadow-md bg-white">
              <h2 className="font-semibold text-lg">{submission.task.title}</h2>
              <p className="text-sm text-gray-600">Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</p>
              <p className={`text-sm font-medium ${submission.status === 'approved' ? 'text-green-600' : submission.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                Status: {submission.status.toUpperCase()}
              </p>
              <p className="text-sm text-blue-700">XP: {submission.task.xp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChildSubmissionHistory;
