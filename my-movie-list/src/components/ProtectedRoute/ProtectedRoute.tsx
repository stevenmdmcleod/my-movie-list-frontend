import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenValid } from '../../utils/jwt';

const ProtectedRoute: React.FC = () => {
    const token = localStorage.getItem('token');

    // Check if the token is valid
    if (!isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    }

    // Render protected content if the token is valid
    return <Outlet />;
};

// Export as default
export default ProtectedRoute;