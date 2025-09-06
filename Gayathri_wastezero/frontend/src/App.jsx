import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from "@/context/AuthContext"
import LoginPage from '@/pages/AuthPages/LoginPage'
import VolunteerDashboard from '@/pages/Dashboards/VolunteerDashboard'
import NgoDashboard from '@/pages/Dashboards/NgoDashboard'
import ErrorPage from '@/pages/ErrorPage'
import AdminDashboard from '@/pages/Dashboards/AdminDashboard'

function App() {
  const { authUser } = useAuthContext();

  const getRoleBasedRedirect = () => {
    if (!authUser) {
      return <Navigate to="/login" replace />
    }
    
    switch (authUser.role.toLowerCase()) {
      case 'volunteer':
        return <Navigate to="/volunteer-dashboard" replace />
      case 'ngo':
        return <Navigate to="/ngo-dashboard" replace />
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!authUser) {
      return <Navigate to="/login" replace />;
    } 
    if (allowedRoles && !allowedRoles.includes(authUser.role.toLowerCase())) {
      return getRoleBasedRedirect();
    }
    
    return children;
  }

  const RoleBasedRedirect = () => {
    return getRoleBasedRedirect();
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={authUser ? <RoleBasedRedirect /> : <LoginPage />}
        />
        <Route
          path="/volunteer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NgoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App