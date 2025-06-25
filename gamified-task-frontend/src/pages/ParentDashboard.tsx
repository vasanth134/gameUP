import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Calendar, CheckCircle, XCircle, Clock, Trophy, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TaskStatusBadge } from '../components/ui/Badge';
import { TaskStatusDropdown } from '../components/TaskStatusDropdown';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SubmissionSummary {
  totalXP: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  xp_reward: number;
  status: string;
  child_name: string;
  created_at: string;
}

const ParentDashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<SubmissionSummary>({
    totalXP: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalPending: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hasChildren = children.length > 0;

  const handleStatusUpdate = (taskId: number, newStatus: string) => {
    setRecentTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch parent's children first
        const childrenRes = await API.get(`/users/parent/${user.id}/children`);
        const parentChildren = childrenRes.data;
        setChildren(parentChildren);

        // Aggregate summary from all children
        let totalSummary = {
          totalXP: 0,
          totalApproved: 0,
          totalRejected: 0,
          totalPending: 0,
        };

        if (parentChildren.length > 0) {
          for (const child of parentChildren) {
            try {
              const summaryRes = await API.get(`/submissions/child/${child.id}/summary`);
              const summaryData = summaryRes.data;
              
              totalSummary.totalXP += summaryData.totalXP || 0;
              totalSummary.totalApproved += summaryData.approved || 0;
              totalSummary.totalRejected += summaryData.rejected || 0;
              totalSummary.totalPending += summaryData.pending || 0;
            } catch (err) {
              console.error(`Failed to load summary for child ${child.id}`, err);
            }
          }
        }

        setSummary(totalSummary);

        // Fetch recent tasks for parent
        const tasksRes = await API.get(`/tasks?userId=${user.id}&role=parent`);
        console.log('Tasks response:', tasksRes.data); // Debug log
        setRecentTasks(Array.isArray(tasksRes.data) ? tasksRes.data.slice(0, 5) : []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const statsCards = [
    {
      title: 'Total XP Earned',
      value: summary.totalXP,
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Approved Tasks',
      value: summary.totalApproved,
      icon: CheckCircle,
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-700'
    },
    {
      title: 'Pending Review',
      value: summary.totalPending,
      icon: Clock,
      color: 'from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Needs Attention',
      value: summary.totalRejected,
      icon: XCircle,
      color: 'from-red-400 to-red-600',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Parent Dashboard
            </h1>
            <p className="text-gray-600 text-lg mt-2">Monitor your child's learning progress</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/create-child-account">
              <Button variant="outline" className="shadow-lg">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Child
              </Button>
            </Link>
            <Link to="/review-submissions">
              <Button variant="secondary" className="shadow-lg">
                <Eye className="h-5 w-5 mr-2" />
                Review Submissions
              </Button>
            </Link>
            <Link to="/assign-task">
              <Button className="shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Task
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
                    <p className="text-gray-600">Latest assigned tasks and their status</p>
                  </div>
                </div>
                <Link to="/tasks">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                          <span>XP: {task.xp_reward}</span>
                          <span>Child: {task.child_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-3">
                          <TaskStatusBadge status={task.status} />
                          <div className="text-sm text-gray-500">
                            Update Status:
                          </div>
                          <TaskStatusDropdown
                            taskId={task.id}
                            currentStatus={task.status}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No tasks assigned yet</p>
                  <Link to="/assign-task">
                    <Button>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Task
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;
