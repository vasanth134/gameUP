import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../services/api';

interface XPData {
  date: string;
  xp: number;
}

const XPProgressChart = () => {
  const [xpData, setXPData] = useState<XPData[]>([]);

  useEffect(() => {
    const fetchXPData = async () => {
      try {
        const response = await API.get('/xp-progress'); // Adjust the endpoint as needed
        setXPData(response.data);
      } catch (error) {
        console.error('Error fetching XP data:', error);
      }
    };

    fetchXPData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">📈 XP Progress Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={xpData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="xp" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPProgressChart;
