import { useState } from 'react';
import API from '../services/api';

const AssignTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xp, setXP] = useState(0);
  const [dueDate, setDueDate] = useState('');

  const childId = 1; // TEMP: Replace with dynamic childId later

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await API.post('/tasks', {
        title,
        description,
        xp,
        due_date: dueDate,
        child_id: childId,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setXP(0);
      setDueDate('');
      alert('✅ Task assigned successfully!');
    } catch (err) {
      console.error('Task assignment failed', err);
      alert('❌ Failed to assign task');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📋 Assign New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-xl">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">XP</label>
          <input
            type="number"
            value={xp}
            onChange={(e) => setXP(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          ➕ Assign Task
        </button>
      </form>
    </div>
  );
};

export default AssignTask;
