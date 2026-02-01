import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShoppingCartContext } from '../../Context';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isUserAuthenticated, account } = useContext(ShoppingCartContext);

  if (!isUserAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (requireAdmin && account?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;