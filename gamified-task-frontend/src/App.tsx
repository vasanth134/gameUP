import { Route, Routes, Navigate } from 'react-router-dom';
import ParentDashboard from './pages/ParentDashboard';
import ChildDashboard from './pages/ChildDashboard';
import ChildNotifications from './pages/ChildNotifications';
import ChildSubmissionHistory from './pages/ChildSubmissionHistory';
import Notifications from './pages/Notifications';
import XPProgress from './pages/XPProgress';
import ReviewSubmissions from './pages/ReviewSubmissions';
import AssignTask from './pages/AssignTask';
import Navbar from './components/Navbar';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/parent-dashboard" />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/child-dashboard" element={<ChildDashboard />} />
      <Route path="/child/notifications" element={<ChildNotifications />} />
<Route path="/child/submissions" element={<ChildSubmissionHistory />} />
<Route path="/child/xp-progress" element={<XPProgress />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/review-submissions" element={<ReviewSubmissions />} />
<Route path="/assign-task" element={<AssignTask />} />
<Route path="/navbar" element={<Navbar />} />
    </Routes>
  );
};

export default App;
