import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Users, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ParentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/login/parent', { email, password });

      // Store user data in auth context instead of localStorage
      login(res.data.user);

      toast.success('Welcome back! 🎉');
      navigate('/parent-dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Parent Login</h1>
                <p className="text-gray-600">Welcome back! Sign in to manage your child's tasks</p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  icon={<Mail className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={<Lock className="h-5 w-5" />}
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                >
                  Sign In
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/parent-signup"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign up here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentLogin;
