import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, onlyAdmin = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (onlyAdmin && user.role !== 'admin') {
    return <Navigate to="/user/reserve" />;
  }

  return children;
}

export default ProtectedRoute;
