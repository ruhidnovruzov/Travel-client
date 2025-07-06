import React from 'react';
import { useRole } from '../../hooks/useRole.js';

// Rol əsaslı komponent göstərmə
const RoleGuard = ({ children, roles = [], showFallback = false, fallback = null }) => {
    const { user, hasRole } = useRole();
    
    // İstifadəçi daxil olmayıb
    if (!user) {
        return showFallback ? fallback : null;
    }
    
    // Rol tələb olunmur
    if (roles.length === 0) {
        return children;
    }
    
    // İstifadəçinin rolunu yoxla
    const hasRequiredRole = roles.some(role => hasRole(role));
    
    if (hasRequiredRole) {
        return children;
    }
    
    return showFallback ? fallback : null;
};

export default RoleGuard;