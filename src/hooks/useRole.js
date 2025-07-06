import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

// Rol yoxlama hook-u
export const useRole = () => {
    const { user } = useContext(AuthContext);
    
    const hasRole = (role) => {
        return user && user.role === role;
    };
    
    const isAdmin = () => {
        return hasRole('admin');
    };
    
    const isUser = () => {
        return hasRole('user');
    };
    
    const isAuthenticated = () => {
        return !!user;
    };
    
    return {
        user,
        hasRole,
        isAdmin,
        isUser,
        isAuthenticated
    };
};