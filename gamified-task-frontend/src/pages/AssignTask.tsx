import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Star, FileText, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Child {
  id: number;
  name: string;
  email: string;
}

const AssignTask = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xp, setXP] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated or not a parent
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'parent') {
      navigate('/auth/parent-login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch parent's children
  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) return;
      
      try {
        const response = await API.get(`/users/parent/${user.id}/children`);
        setChildren(response.data);
        
        // Auto-select first child if only one exists
        if (response.data.length === 1) {
          setSelectedChildId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch children:', error);
        toast.error('Failed to load children');
      }
    };

    fetchChildren();
  }, [user]);

  // Don't render if user is not authenticated or not a parent
  if (!isAuthenticated || !user || user.role !== 'parent') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedChildId) {
      toast.error('Please select a child to assign the task to');
      return;
    }
    
    setLoading(true);

    try {
      await API.post('/tasks', {
        title,
        description,
        xp_reward: xp,
        due_date: dueDate,
        child_id: selectedChildId,
        parent_id: user.id,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setXP(0);
      setDueDate('');
      setSelectedChildId(children.length === 1 ? children[0].id : null);
      
      toast.success('🎉 Task assigned successfully!');
      
      // Navigate back to parent dashboard after successful creation
      setTimeout(() => {
        navigate('/parent-dashboard');
      }, 1500);
    } catch (err) {
      console.error('Task assignment failed', err);
      toast.error('❌ Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/parent-dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create New Task
          </h1>
          <p className="text-gray-600 text-lg">Assign an engaging task to help your child learn and grow</p>
        </motion.div>

        {/* Task Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                  <p className="text-gray-600">Fill in the information below</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Task Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Complete math worksheet, Read a story..."
                  icon={<FileText className="h-5 w-5" />}
                  required
                />

                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed instructions for the task..."
                  rows={4}
                  required
                />

                {/* Child Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Assign to Child *
                  </label>
                  <select
                    value={selectedChildId || ''}
                    onChange={(e) => setSelectedChildId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a child...</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="XP Reward"
                    type="number"
                    value={xp}
                    onChange={(e) => setXP(Number(e.target.value))}
                    placeholder="50"
                    min="1"
                    icon={<Star className="h-5 w-5" />}
                    required
                  />

                  <Input
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    icon={<Calendar className="h-5 w-5" />}
                    required
                  />
                </div>

                {/* XP Preview */}
                {xp > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="h-6 w-6 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-yellow-800">
                          This task will reward {xp} XP points!
                        </p>
                        <p className="text-sm text-yellow-600">
                          Great motivation for your child to complete the task
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setTitle('');
                      setDescription('');
                      setXP(0);
                      setDueDate('');
                    }}
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="min-w-[140px]"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Assign Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignTask;
