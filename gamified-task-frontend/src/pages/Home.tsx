import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, Star, Trophy, Target } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: 'Task Management',
      description: 'Create and assign engaging tasks with XP rewards'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Level up system that motivates continuous learning'
    },
    {
      icon: Star,
      title: 'Progress Tracking',
      description: 'Monitor achievements and celebrate milestones'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              GameUP
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Gamified Learning Platform
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Transform everyday tasks into exciting adventures. Parents create engaging challenges, 
              children earn XP and level up their learning journey!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card hover className="p-6 min-w-[280px]">
                  <CardContent className="text-center space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-fit mx-auto">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Parents</h3>
                    <p className="text-gray-600">Create tasks, track progress, and motivate learning</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full"
                        onClick={() => navigate('/auth/parent-login')}
                      >
                        Login as Parent
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/auth/parent-signup')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card hover className="p-6 min-w-[280px]">
                  <CardContent className="text-center space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-fit mx-auto">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Children</h3>
                    <p className="text-gray-600">Complete tasks, earn XP, and level up your skills</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full"
                        onClick={() => navigate('/auth/child-login')}
                      >
                        Login as Child
                      </Button>
                      {/* <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/auth/child-signup')}
                      >
                        Sign Up
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose GameUP?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the power of gamification with effective learning management 
              to create an engaging educational experience for both parents and children.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-fit mx-auto mb-6">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: '500+', label: 'XP Points Earned' },
              { number: '95%', label: 'Task Completion Rate' },
              { number: '50+', label: 'Learning Achievements' },
              { number: '24/7', label: 'Progress Tracking' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
