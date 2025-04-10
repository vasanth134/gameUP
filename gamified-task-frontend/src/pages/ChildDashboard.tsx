import { useEffect, useState } from 'react';
import API from '../services/api';
import XPProgressChart from '../components/XPProgressChart';

interface Task {
  id: number;
  title: string;
  description: string;
  xp: number;
  due_date: string;
}

interface Submission {
  task_id: number;
  status: string;
  submitted_at: string;
}

interface XPInfo {
  totalXP: number;
}

const ChildDashboard = () => {
  const childId = 1; // TEMP: Replace with session/user context later
  const [tasks, setTasks] = useState<Task[]>([]);
  const [xp, setXP] = useState<XPInfo | null>(null);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await API.get(`/tasks/child/${childId}`);
      setTasks(res.data);
    };

    const fetchXP = async () => {
      const res = await API.get(`/submissions/child/${childId}/summary`);
      setXP({ totalXP: res.data.totalXP });
    };

    const fetchSubmissions = async () => {
      const res = await API.get(`/submissions/child/${childId}/status-summary`);
      const ids = res.data.map((s: Submission) => s.task_id);
      setSubmittedTaskIds(ids);
    };

    fetchTasks();
    fetchXP();
    fetchSubmissions();
  }, []);

  const handleSubmit = async (taskId: number) => {
    try {
      await API.post(`/submissions`, {
        child_id: childId,
        task_id: taskId,
        status: 'pending',
      });
      setSubmittedTaskIds([...submittedTaskIds, taskId]);
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <XPProgressChart />
      <h1 className="text-2xl font-bold mb-6">🎮 Child Dashboard</h1>

      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">🏆 Total XP: {xp?.totalXP ?? 0}</h2>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📝 Assigned Tasks</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border p-4 rounded-xl bg-gray-50">
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p className="mb-2">{task.description}</p>
              <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
              <p className="text-sm text-green-600">XP: {task.xp}</p>

              {submittedTaskIds.includes(task.id) ? (
                <button
                  className="mt-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  disabled
                >
                  Submitted
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(task.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Task
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildDashboard;
