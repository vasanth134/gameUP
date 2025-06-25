import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  role: 'parent' | 'child';
  children: JSX.Element;
}

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated or wrong role
  if (!isAuthenticated || !user || user.role !== role) {
    const loginPath = role === 'parent' ? '/auth/parent-login' : '/auth/child-login';
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
