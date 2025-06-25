import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, Calendar, Star, FileText, Image, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Submission {
  submission_id: number;
  task_id: number;
  child_id: number;
  submission_text: string;
  file_path: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  status: 'pending' | 'approved' | 'rejected';
  feedback: string | null;
  task_title: string;
  task_description: string;
  xp_reward: number;
  child_name: string;
}

const ReviewSubmissions = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Redirect if not authenticated or not a parent
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'parent') {
      navigate('/auth/parent-login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render if user is not authenticated or not a parent
  if (!isAuthenticated || !user || user.role !== 'parent') {
    return null;
  }

  useEffect(() => {
    fetchSubmissions();
  }, [filter, user]);

  const fetchSubmissions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const endpoint = filter === 'pending' 
        ? `/submissions/parent/${user.id}/pending`
        : `/submissions/parent/${user.id}/all`;
      
      const response = await API.get(endpoint);
      const submissionsData = filter === 'pending' 
        ? response.data.pendingSubmissions || []
        : response.data.submissions || [];
      
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: number, status: 'approved' | 'rejected') => {
    try {
      setReviewingId(submissionId);
      
      const response = await API.put(`/submissions/${submissionId}/review`, {
        status,
        feedback: feedback || undefined,
      });

      if (response.data.success) {
        const actionMessage = status === 'approved' 
          ? `✅ Task approved! ${response.data.xpAwarded ? `Child earned ${response.data.xpAwarded} XP!` : ''}`
          : '❌ Task marked for improvement';
        
        toast.success(actionMessage);
        setFeedback('');
        fetchSubmissions(); // Refresh the list
      }
    } catch (error: any) {
      console.error('Failed to review submission:', error);
      const errorMessage = error.response?.data?.error || 'Failed to review submission';
      toast.error(errorMessage);
    } finally {
      setReviewingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">⏳ Pending Review</Badge>;
      case 'approved':
        return <Badge variant="success">✅ Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">❌ Needs Work</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📋 Review Submissions
          </h1>
          <p className="text-gray-600 text-lg">
            Review and approve your children's task submissions
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({submissions.filter(s => s.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Submissions ({submissions.length})
            </button>
          </div>
        </motion.div>

        {/* Submissions List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card>
              <CardContent className="p-12">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'pending' ? 'No pending submissions' : 'No submissions yet'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'pending' 
                    ? 'All caught up! Check back later for new submissions.'
                    : 'Your children haven\'t submitted any tasks yet.'
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.submission_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover>
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {submission.task_title}
                        </h3>
                        <p className="text-gray-600 mb-3">{submission.task_description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>By {submission.child_name}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted {formatDate(submission.submitted_at)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-600 font-medium">{submission.xp_reward} XP</span>
                          </span>
                        </div>
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>

                    {/* Submission Content */}
                    {submission.submission_text && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Child's Description</span>
                        </div>
                        <p className="text-gray-800">{submission.submission_text}</p>
                      </div>
                    )}

                    {/* Photo */}
                    {submission.file_path && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Image className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Submitted Photo</span>
                        </div>
                        <img
                          src={`http://localhost:3001${submission.file_path}`}
                          alt="Submission"
                          className="max-w-sm h-48 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setExpandedImage(`http://localhost:3001${submission.file_path}`)}
                        />
                      </div>
                    )}

                    {/* Previous Feedback */}
                    {submission.feedback && submission.status === 'rejected' && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">Previous Feedback</span>
                        </div>
                        <p className="text-red-800">{submission.feedback}</p>
                      </div>
                    )}

                    {/* Review Actions (only for pending submissions) */}
                    {submission.status === 'pending' && (
                      <div className="border-t pt-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback (optional)
                          </label>
                          <textarea
                            value={reviewingId === submission.submission_id ? feedback : ''}
                            onChange={(e) => {
                              if (reviewingId === submission.submission_id) {
                                setFeedback(e.target.value);
                              }
                            }}
                            onFocus={() => setReviewingId(submission.submission_id)}
                            placeholder="Add feedback for the child..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => handleReview(submission.submission_id, 'approved')}
                            disabled={reviewingId === submission.submission_id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve & Award XP
                          </Button>
                          <Button
                            onClick={() => handleReview(submission.submission_id, 'rejected')}
                            disabled={reviewingId === submission.submission_id}
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Needs Improvement
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Reviewed Status */}
                    {submission.status !== 'pending' && submission.reviewed_at && (
                      <div className="border-t pt-4 text-sm text-gray-500">
                        Reviewed on {formatDate(submission.reviewed_at)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setExpandedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={expandedImage}
              alt="Expanded submission"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmissions;
