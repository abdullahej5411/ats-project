// src/App.js — Main Router

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/common/Navbar';

// Public Pages
import Home        from './pages/public/Home';
import JobList     from './pages/public/JobList';
import JobDetail   from './pages/public/JobDetail';

// Auth Pages
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Candidate Pages
import CandidateDashboard  from './pages/candidate/Dashboard';
import CandidateProfile    from './pages/candidate/Profile';
import MyApplications      from './pages/candidate/MyApplications';
import MyInterviews        from './pages/candidate/MyInterviews';
import ApplyJob            from './pages/candidate/ApplyJob';

// HR Pages
import HRDashboard      from './pages/hr/Dashboard';
import HRJobs           from './pages/hr/Jobs';
import JobForm          from './pages/hr/JobForm';
import HRApplications   from './pages/hr/Applications';
import ApplicationDetail from './pages/hr/ApplicationDetail';
import HRInterviews     from './pages/hr/Interviews';
import ScheduleInterview from './pages/hr/ScheduleInterview';
import HRBranches       from './pages/hr/Branches';

// Protected Route Wrappers
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/jobs"      element={<JobList />} />
        <Route path="/jobs/:id"  element={<JobDetail />} />

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate */}
        <Route path="/candidate" element={
          <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/candidate/profile" element={
          <ProtectedRoute role="candidate"><CandidateProfile /></ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute role="candidate"><MyApplications /></ProtectedRoute>
        } />
        <Route path="/candidate/interviews" element={
          <ProtectedRoute role="candidate"><MyInterviews /></ProtectedRoute>
        } />
        <Route path="/candidate/apply/:jobId" element={
          <ProtectedRoute role="candidate"><ApplyJob /></ProtectedRoute>
        } />

        {/* HR */}
        <Route path="/hr" element={
          <ProtectedRoute role="hr"><HRDashboard /></ProtectedRoute>
        } />
        <Route path="/hr/jobs" element={
          <ProtectedRoute role="hr"><HRJobs /></ProtectedRoute>
        } />
        <Route path="/hr/jobs/new" element={
          <ProtectedRoute role="hr"><JobForm /></ProtectedRoute>
        } />
        <Route path="/hr/jobs/edit/:id" element={
          <ProtectedRoute role="hr"><JobForm /></ProtectedRoute>
        } />
        <Route path="/hr/applications" element={
          <ProtectedRoute role="hr"><HRApplications /></ProtectedRoute>
        } />
        <Route path="/hr/applications/:id" element={
          <ProtectedRoute role="hr"><ApplicationDetail /></ProtectedRoute>
        } />
        <Route path="/hr/interviews" element={
          <ProtectedRoute role="hr"><HRInterviews /></ProtectedRoute>
        } />
        <Route path="/hr/interviews/schedule/:applicationId" element={
          <ProtectedRoute role="hr"><ScheduleInterview /></ProtectedRoute>
        } />
        <Route path="/hr/branches" element={
          <ProtectedRoute role="hr"><HRBranches /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
