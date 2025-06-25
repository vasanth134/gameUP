import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const CreateChildAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated or not a parent
  if (!isAuthenticated || !user || user.role !== 'parent') {
    navigate('/auth/parent-login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Debug: Log the user data being sent
    console.log('Creating child account with parent data:', {
      parentId: user.id,
      parentName: user.name,
      parentEmail: user.email,
      parentRole: user.role
    });

    setLoading(true);

    try {
      await API.post('/auth/signup/child', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        parent_id: user.id, // Automatically link to the logged-in parent
      });

      toast.success(`🎉 Child account created successfully for ${formData.name}!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Navigate back to parent dashboard after 2 seconds
      setTimeout(() => {
        navigate('/parent-dashboard');
      }, 2000);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create child account';
      console.error('Child signup error:', err.response?.data);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
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
            Create Child Account
          </h1>
          <p className="text-gray-600 text-lg">Set up a new account for your child to start their learning journey</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-fit mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Child Account</h2>
                <p className="text-gray-600">Enter your child's information below</p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Child's Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your child's name"
                  icon={<User className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="child@example.com"
                  icon={<Mail className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password for your child"
                  icon={<Lock className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm the password"
                  icon={<Lock className="h-5 w-5" />}
                  required
                />

                {/* Parent Info Display */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Parent Information</h3>
                  <p className="text-sm text-blue-700">
                    <strong>Parent:</strong> {user.name} ({user.email})
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    This child will be automatically linked to your account
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating Account...' : 'Create Child Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 max-w-md mx-auto"
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Child account will be created and linked to your account
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Your child can login with the email and password you set
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  You can assign tasks and track their progress
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  They will only see tasks you assign to them
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateChildAccount;
