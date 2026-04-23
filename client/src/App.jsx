import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import AdminUsers from './pages/AdminUsers';
import LandingPage from './pages/LandingPage';
import CandidatePublicProfile from './pages/CandidatePublicProfile';
import Footer from './components/layout/Footer';
import { SocketProvider } from './context/SocketContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Recruiter Only Route
const RecruiterRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'recruiter') return <Navigate to="/jobs" />;
  return children;
};

// Admin Only Route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/jobs" />;
  return children;
};

function MainLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <div className="min-h-screen bg-gray-50/30">
      {!isLandingPage && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/jobs" /> : <LandingPage />} />
        <Route path="/jobs" element={<JobFeed />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/company/:id" element={<CompanyPublicProfile />} />
        <Route path="/candidate/:id" element={<CandidatePublicProfile />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/jobs" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/jobs" /> : <Register />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <Chat />
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

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isChatPage && <Footer />}
    </div>
  );
}

function App() {
  const { setAuth, clearAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getProfile();
        setAuth(data);
      } catch (err) {
        // Not authorized, which is fine for public pages
        clearAuth();
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setAuth, clearAuth]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Đang khởi tạo Hiretify...</p>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <Router>
        <MainLayout />
      </Router>
    </SocketProvider>
  );
}

export default App;
