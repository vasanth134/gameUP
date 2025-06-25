import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

interface XPData {
  date: string;
  xp: number;
}

const XPProgressChart = () => {
  const { user } = useAuth();
  const [xpData, setXPData] = useState<XPData[]>([]);

  useEffect(() => {
    // Generate mock XP progress data for now
    // In a real implementation, this would fetch from an API
    const generateMockData = () => {
      const data: XPData[] = [];
      const today = new Date();
      const currentXP = user?.total_xp || 0;
      
      // Generate data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Simulate progressive XP growth
        const progressFactor = (7 - i) / 7;
        const xp = Math.floor(currentXP * progressFactor);
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          xp: xp
        });
      }
      
      setXPData(data);
    };

    generateMockData();
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">📈 XP Progress Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={xpData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="xp" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPProgressChart;
