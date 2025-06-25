import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Users, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ChildSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    parentEmail: 'parent@example.com', // Default parent email for demo
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/auth/signup/child', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        parent_id: formData.parentEmail, // This should be parent ID, but we'll need to look up by email
      });
      toast.success('Account created successfully! Please login.');
      navigate('/auth/child-login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
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
                <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-fit mx-auto mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Child Account</h1>
                <p className="text-gray-600">Join the adventure and start earning XP!</p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  icon={<User className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="child@example.com"
                  icon={<Mail className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  icon={<Lock className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Parent Email"
                  name="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  placeholder="parent@example.com"
                  icon={<Users className="h-5 w-5" />}
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                >
                  Start My Adventure! 🚀
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/auth/child-login"
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Sign in here
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

export default ChildSignup;