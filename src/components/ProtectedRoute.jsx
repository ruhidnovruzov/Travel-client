import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import UnauthorizedPage from '../pages/Error/UnauthorizedPage.jsx';
import LoadingSpinner from './common/LoadingSpinner.jsx';

const ProtectedRoute = ({ children, requireAuth = true, requiredRole = null }) => {
    const { user, loading } = useContext(AuthContext);

    // Yükləmə halında spinner göstər
    if (loading) {
        return <LoadingSpinner />;
    }

    // Giriş tələb olunur və istifadəçi daxil olmayıb
    if (requireAuth && !user) {
        return <UnauthorizedPage type="login" />;
    }

    // Rol tələb olunur və istifadəçinin rolu uyğun deyil
    if (requiredRole && user && user.role !== requiredRole) {
        return <UnauthorizedPage type="forbidden" />;
    }

    // Hər şey qaydasındadır, uşaq komponentini göstər
    return children;
};

export default ProtectedRoute;