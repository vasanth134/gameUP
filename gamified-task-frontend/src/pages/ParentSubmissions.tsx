import { useEffect, useState } from 'react';
import API from '../services/api';

interface Submission {
  id: number;
  task: {
    title: string;
    xp: number;
  };
  child_id: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const ParentSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await API.get('/submissions/parent/1'); // Replace with dynamic parent_id later
      setSubmissions(res.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await API.put(`/submissions/${id}/status`, { status });
      fetchSubmissions(); // refresh after update
    } catch (error) {
      console.error('Failed to update submission status', error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📥 Task Submissions</h1>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-white p-4 shadow-md rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{sub.task.title}</h2>
                <p className="text-gray-600 text-sm">
                  Submitted by Child ID: {sub.child_id}
                </p>
                <p className="text-gray-500 text-xs">XP: {sub.task.xp}</p>
                <p className="text-gray-400 text-xs">Submitted: {new Date(sub.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {sub.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => updateStatus(sub.id, 'approved')}
                      className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(sub.id, 'rejected')}
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-4 py-1 rounded-md text-white ${
                      sub.status === 'approved' ? 'bg-green-600' : 'bg-red-500'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentSubmissions;
