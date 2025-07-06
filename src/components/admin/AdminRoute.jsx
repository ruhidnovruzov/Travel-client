import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import UnauthorizedPage from '../../pages/Error/UnauthorizedPage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // Yükləmə halında spinner göstər
    if (loading) {
        return <LoadingSpinner />;
    }

    // İstifadəçi daxil olmayıb
    if (!user) {
        return <UnauthorizedPage type="login" />;
    }

    // İstifadəçi admin deyil
    if (user.role !== 'admin') {
        return <UnauthorizedPage type="forbidden" />;
    }

    // İstifadəçi admindir, admin panelini göstər
    return children;
};

export default AdminRoute;