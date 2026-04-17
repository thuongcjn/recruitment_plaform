import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { getProfile } from './api/authApi';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import JobFeed from './pages/JobFeed';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import EditJob from './pages/EditJob';
import CompanyPublicProfile from './pages/CompanyPublicProfile';
import Navbar from './components/layout/Navbar';
import AppliedJobs from './pages/AppliedJobs';
import ViewApplicants from './pages/ViewApplicants';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Recruiter Only Route
const RecruiterRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'recruiter') return <Navigate to="/" />;
  return children;
};

function App() {
  const { setAuth, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getProfile();
        setAuth(data);
      } catch (err) {
        // Not authorized, which is fine for public pages
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setAuth, logout]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Initializing Hiretify...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50/30">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<JobFeed />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/company/:id" element={<CompanyPublicProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Recruiter Routes */}
          <Route 
            path="/post-job" 
            element={
              <RecruiterRoute>
                <PostJob />
              </RecruiterRoute>
            } 
          />

          <Route 
            path="/my-jobs" 
            element={
              <RecruiterRoute>
                <MyJobs />
              </RecruiterRoute>
            } 
          />

          <Route 
            path="/edit-job/:id" 
            element={
              <RecruiterRoute>
                <EditJob />
              </RecruiterRoute>
            } 
          />

          <Route 
            path="/applied-jobs" 
            element={
              <ProtectedRoute>
                <AppliedJobs />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/applicants/:jobId" 
            element={
              <RecruiterRoute>
                <ViewApplicants />
              </RecruiterRoute>
            } 
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
