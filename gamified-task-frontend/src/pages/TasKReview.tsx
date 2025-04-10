import { useEffect, useState } from 'react';
import API from '../services/api';

interface TaskSubmission {
  submission_id: number;
  task_title: string;
  task_description: string;
  xp: number;
  submitted_at: string;
  status: string;
}

const TaskReview = () => {
  const childId = 1; // Replace with dynamic child ID
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);

  const fetchSubmissions = async () => {
    try {
      const res = await API.get(`/submissions/child/${childId}/all`);
      setSubmissions(res.data);
    } catch (err) {
      console.error('Failed to load submissions', err);
    }
  };

  const handleAction = async (submissionId: number, action: 'approved' | 'rejected') => {
    try {
      await API.put(`/submissions/${submissionId}/status`, {
        status: action,
      });
      fetchSubmissions(); // refresh list
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📋 Task Review</h1>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.submission_id}
              className="bg-white p-4 rounded-xl shadow-md border"
            >
              <h2 className="text-lg font-bold">{submission.task_title}</h2>
              <p>{submission.task_description}</p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(submission.submitted_at).toLocaleString()}
              </p>
              <p className="text-green-600 font-medium">XP: {submission.xp}</p>

              <div className="mt-3">
                {submission.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      onClick={() => handleAction(submission.submission_id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      onClick={() => handleAction(submission.submission_id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="px-3 py-1 rounded-lg text-sm bg-gray-200 text-gray-600">
                    Status: {submission.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskReview;
    