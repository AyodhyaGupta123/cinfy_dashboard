import { useAuth } from '../../context/AuthContext';

/**
 * PrivateRoute component to protect dashboard pages.
 * Redirects to /login if no authentication user is found.
 */
const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a full-page spinner

  return user ? (
    <Outlet /> // Renders the child route (e.g., DashboardLayout)
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
