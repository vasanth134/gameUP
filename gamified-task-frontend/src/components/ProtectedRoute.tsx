import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  role: 'parent' | 'child';
  children: JSX.Element;
}

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || user.role !== role) {
    // Redirect to appropriate login page
    const loginPath = role === 'parent' ? '/auth/parent-login' : '/auth/child-login';
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
