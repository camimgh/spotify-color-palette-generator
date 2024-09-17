import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('access_token');
  
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
