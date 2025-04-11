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


interface XPInfo {
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
}

const ChildDashboard = () => {
  const childId = 1; // TEMP: Replace with logged-in user ID
  const [tasks, setTasks] = useState<Task[]>([]);
  const [xp, setXP] = useState<XPInfo>({
    currentXP: 0,
    nextLevelXP: 100,
    totalXP: 0,
  });
  const [submittedTaskIds, setSubmittedTaskIds] = useState<number[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    submitted: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [taskRes, xpRes, statusRes] = await Promise.all([
          API.get(`/tasks/child/${childId}`),
          API.get(`/xp/child/${childId}`),
          API.get(`/submissions/child/${childId}/status-summary`),
        ]);

        setTasks(taskRes.data);
        setXP({
          currentXP: xpRes.data.currentXP,
          nextLevelXP: xpRes.data.nextLevelXP,
          totalXP: xpRes.data.totalXP,
        });

        const summaryMap: Record<string, number> = {};
        const submittedIds: number[] = [];

        statusRes.data.forEach((item: any) => {
          const status = item.status.toLowerCase();
          summaryMap[status] = item.count;
          if (status === 'submitted' || status === 'pending' || status === 'approved') {
            submittedIds.push(item.task_id);
          }
        });

        setStatusCounts({
          submitted: summaryMap['submitted'] || 0,
          approved: summaryMap['approved'] || 0,
          rejected: summaryMap['rejected'] || 0,
        });

        setSubmittedTaskIds(submittedIds);
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
      }
    };

    fetchAllData();
  }, []);

  const progressPercent = Math.min((xp.currentXP / xp.nextLevelXP) * 100, 100);

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
      <h1 className="text-3xl font-bold mb-6 text-center">🎮 Welcome, Child!</h1>

      {/* XP Summary */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">XP Summary</h2>
        <p className="mb-2">Current XP: <strong>{xp.currentXP}</strong></p>
        <p className="mb-2">Next Level XP: <strong>{xp.nextLevelXP}</strong></p>
        <p className="mb-4">Total Earned XP: <strong>{xp.totalXP}</strong></p>
        <div className="w-full bg-gray-200 rounded-full h-5">
          <div
            className="bg-green-500 h-full rounded-full text-white text-sm text-center"
            style={{ width: `${progressPercent}%` }}
          >
            {Math.floor(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Task Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow text-center">
          <p className="text-2xl font-bold">{statusCounts.submitted}</p>
          <p>Submitted</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow text-center">
          <p className="text-2xl font-bold">{statusCounts.approved}</p>
          <p>Approved</p>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow text-center">
          <p className="text-2xl font-bold">{statusCounts.rejected}</p>
          <p>Rejected</p>
        </div>
      </div>

      {/* XP Chart */}
      <XPProgressChart />

      {/* Task List */}
      <div className="bg-white shadow-md rounded-2xl p-6 mt-8">
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
