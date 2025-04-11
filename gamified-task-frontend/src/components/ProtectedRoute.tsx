import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  role: 'parent' | 'child';
  children: JSX.Element;
}

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const userRole = localStorage.getItem('role');

  if (!userRole || userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
