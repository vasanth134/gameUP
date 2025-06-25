import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Target, Calendar, Upload, CheckCircle, Clock, XCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TaskStatusBadge } from '../components/ui/Badge';
import XPCard from '../components/XPCard';
import XPProgressChart from '../components/XPProgressChart';
import TaskSubmissionModal from '../components/TaskSubmissionModal';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  due_date: string;
  status: string;
}

interface XPInfo {
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
}

const ChildDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not a child
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'child') {
      navigate('/auth/child-login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

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
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  // Don't render if user is not authenticated or not a child
  if (!isAuthenticated || !user || user.role !== 'child') {
    return null;
  }

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      
      try {
        const [taskRes, xpRes, statusRes] = await Promise.all([
          API.get(`/tasks?userId=${user.id}&role=child`),
          API.get(`/users/${user.id}`),
          API.get(`/submissions/child/${user.id}/status-summary`),
        ]);

        setTasks(taskRes.data || []);
        setXP({
          currentXP: xpRes.data.total_xp % 100,
          nextLevelXP: 100,
          totalXP: xpRes.data.total_xp,
        });

        const summaryMap: Record<string, number> = {};
        const submittedIds: number[] = [];

        if (statusRes.data) {
          statusRes.data.forEach((item: any) => {
            const status = item.status.toLowerCase();
            summaryMap[status] = parseInt(item.count);
            if (status === 'submitted' || status === 'pending' || status === 'reviewed' || status === 'approved') {
              // Add all task_ids for submitted/pending/reviewed tasks
              if (item.task_ids && Array.isArray(item.task_ids)) {
                submittedIds.push(...item.task_ids);
              }
            }
          });
        }

        setStatusCounts({
          submitted: summaryMap['submitted'] || 0,
          approved: summaryMap['reviewed'] || 0,
          rejected: summaryMap['rejected'] || 0,
          pending: summaryMap['pending'] || 0,
        });

        setSubmittedTaskIds(submittedIds);
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const progressPercent = Math.min((xp.currentXP / xp.nextLevelXP) * 100, 100);
  const currentLevel = Math.floor(xp.totalXP / 100) + 1;

  const handleSubmit = (task: Task) => {
    setSelectedTask(task);
    setIsSubmissionModalOpen(true);
  };

  const handleSubmissionSuccess = async () => {
    if (!user || !selectedTask) return;
    
    // Update local state to reflect the submission
    setSubmittedTaskIds([...submittedTaskIds, selectedTask.id]);
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === selectedTask.id ? { ...task, status: 'submitted' } : task
      )
    );

    // Refresh dashboard data
    try {
      const [xpRes, statusRes] = await Promise.all([
        API.get(`/users/${user.id}`),
        API.get(`/submissions/child/${user.id}/status-summary`),
      ]);

      setXP({
        currentXP: xpRes.data.total_xp % 100,
        nextLevelXP: 100,
        totalXP: xpRes.data.total_xp,
      });

      const summaryMap: Record<string, number> = {};
      const submittedIds: number[] = [];

      if (statusRes.data) {
        statusRes.data.forEach((item: any) => {
          const status = item.status.toLowerCase();
          summaryMap[status] = parseInt(item.count);
          if (status === 'submitted' || status === 'pending' || status === 'reviewed' || status === 'approved') {
            if (item.task_ids && Array.isArray(item.task_ids)) {
              submittedIds.push(...item.task_ids);
            }
          }
        });
      }

      setStatusCounts({
        submitted: summaryMap['submitted'] || 0,
        approved: summaryMap['reviewed'] || 0,
        rejected: summaryMap['rejected'] || 0,
        pending: summaryMap['pending'] || 0,
      });

      setSubmittedTaskIds(submittedIds);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    }
  };

  const urgentTasks = tasks.filter(task => {
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && task.status === 'pending';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎮 Welcome Back, Champion!
          </h1>
          <p className="text-gray-600 text-lg">
            Level {currentLevel} Explorer • Keep learning and earning XP!
          </p>
        </motion.div>

        {/* XP Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card gradient>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">XP Progress</h2>
                    <p className="text-gray-600">Level {currentLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {xp.totalXP}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Total XP</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress to Level {currentLevel + 1}</span>
                  <span>{xp.currentXP}/{xp.nextLevelXP} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {Math.floor(progressPercent)}%
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Submitted', value: statusCounts.submitted, icon: Upload, color: 'from-blue-400 to-blue-600' },
            { title: 'Approved', value: statusCounts.approved, icon: CheckCircle, color: 'from-green-400 to-green-600' },
            { title: 'Pending', value: statusCounts.pending, icon: Clock, color: 'from-yellow-400 to-yellow-600' },
            { title: 'Needs Work', value: statusCounts.rejected, icon: XCircle, color: 'from-red-400 to-red-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card hover>
                <CardContent className="p-4 text-center">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} mx-auto mb-3 w-fit`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {loading ? '...' : stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
                      <p className="text-gray-600">Complete tasks to earn XP</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : tasks.length > 0 ? (
                    <div className="space-y-4">
                      {tasks.map((task) => {
                        const isSubmitted = submittedTaskIds.includes(task.id) || task.status !== 'pending';
                        const dueDate = new Date(task.due_date);
                        const isUrgent = urgentTasks.some(t => t.id === task.id);
                        
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              isUrgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                            } hover:shadow-md`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">{task.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className={isUrgent ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                                      Due: {dueDate.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="text-yellow-600 font-semibold">{task.xp_reward} XP</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <TaskStatusBadge status={task.status} />
                                {isSubmitted ? (
                                  <Button variant="secondary" size="sm" disabled>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Submitted
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmit(task)}
                                    className={isUrgent ? 'bg-red-500 hover:bg-red-600' : ''}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Submit
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No tasks assigned yet</p>
                      <p className="text-sm text-gray-400">Check back later for new tasks!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* XP Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <XPCard
                xp={xp.totalXP}
                approved={statusCounts.approved}
                rejected={statusCounts.rejected}
                pending={statusCounts.pending}
                total={statusCounts.submitted + statusCounts.approved + statusCounts.rejected}
              />
            </motion.div>

            {/* XP Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <XPProgressChart />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {selectedTask && (
        <TaskSubmissionModal
          isOpen={isSubmissionModalOpen}
          onClose={() => {
            setIsSubmissionModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          childId={user?.id || 0}
          onSubmissionSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
  );
};

export default ChildDashboard;
