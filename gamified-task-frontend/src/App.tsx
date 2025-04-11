import { Route, Routes} from 'react-router-dom';
import ParentDashboard from './pages/ParentDashboard';
import ChildDashboard from './pages/ChildDashboard';
import ChildNotifications from './pages/ChildNotifications';
import ChildSubmissionHistory from './pages/ChildSubmissionHistory';
import Notifications from './pages/Notifications';
import XPProgress from './pages/XPProgress';
import ReviewSubmissions from './pages/ReviewSubmissions';
import AssignTask from './pages/AssignTask';
import Navbar from './components/Navbar';
import ParentLogin from './pages/auth/ParentLogin';
import ChildLogin from './pages/auth/ChildLogin';
import ProtectedRoute from './components/ProtectedRoute';
import ChildLayout from './layouts/ChildLayout';
import ChildProfile from './pages/ChildProfile';
import Home from './pages/Home';
import ParentSignup from './pages/auth/ParentSignup';
import ChildSignup from './pages/auth/ChildSignup';



const App = () => {
  return (
    <Routes>
      {/* Redirect root to parent dashboard */}
      <Route path="/" element={<Home/>} />

      {/* Login Routes */}
      <Route path="/login/parent" element={<ParentLogin />} />
      <Route path="/login/child" element={<ChildLogin />} />
      <Route path="/signup/parent" element={<ParentSignup />} />
      <Route path="/signup/child" element={<ChildSignup />} />

      {/* Protected Parent Routes */}
      <Route
        path="/parent-dashboard"
        element={
          <ProtectedRoute role="parent">
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assign-task"
        element={
          <ProtectedRoute role="parent">
            <AssignTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review-submissions"
        element={
          <ProtectedRoute role="parent">
            <ReviewSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute role="parent">
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* Protected Child Routes with Layout */}
      <Route
        path="/child"
        element={
          <ProtectedRoute role="child">
            <ChildLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ChildDashboard />} />
        <Route path="xp-progress" element={<XPProgress />} />
        <Route path="notifications" element={<ChildNotifications />} />
        <Route path="submissions" element={<ChildSubmissionHistory />} />
        <Route path="profile" element={<ChildProfile />} />
      </Route>

      {/* Dev Route */}
      <Route path="/navbar" element={<Navbar />} />

    </Routes>
  );
};

export default App;
