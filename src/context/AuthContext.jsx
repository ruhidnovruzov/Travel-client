import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Axios instance-i yaradırıq. Bu, bütün API çağırışları üçün baza URL-i və çərəzləri avtomatik idarə edəcək.
const API = axios.create({
    baseURL: 'https://travel-back-new.onrender.com/api',
    withCredentials: true,
});

// AuthContext yaradırıq. Bu, tətbiqin hər yerində autentifikasiya məlumatlarına daxil olmağa imkan verəcək.
export const AuthContext = createContext();

// AuthProvider komponenti, autentifikasiya state-ini idarə edir və uşaq komponentlərinə ötürür.
export const AuthProvider = ({ children }) => {
    // İstifadəçi məlumatlarını, yüklənmə state-ini və xəta mesajlarını saxlayırıq.
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tətbiq yükləndikdə və ya user state-i dəyişdikdə işə düşür.
    // Çərəzlərdən istifadəçi məlumatlarını çəkmək üçün `getMe` API çağırışını edir.
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
            try {
                const res = await API.get('/auth/me');
                setUser(res.data.data);
            } catch (err) {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Qeydiyyat funksiyası
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post('/auth/register', userData);
            // Qeydiyyatdan sonra istifadəçini avtomatik daxil etmirik,
            // əvəzinə doğrulama e-poçtunun göndərilməsi barədə mesaj qaytarırıq.
            return { success: true, message: res.data.message, user: res.data.user };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Daxil olma funksiyası
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post('/auth/login', credentials);
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            return { success: true, message: 'Uğurla daxil oldunuz.' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Daxil olma zamanı xəta baş verdi.';
            setError(errorMessage);
            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Sistemdən çıxış funksiyası
    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await API.get('/auth/logout');
        } catch (err) {
            // Xəta olsa belə local state-i təmizlə
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setLoading(false);
        }
        return { success: true, message: 'Uğurla çıxış edildi.' };
    };

    // Email doğrulama funksiyası (OTP ilə)
    const verifyEmail = async (email, otp) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post('/auth/verify-email', { email, otp });
            setUser(res.data.user);
            return { success: true, message: res.data.message || 'Email uğurla doğrulandı.' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Email doğrulama zamanı xəta baş verdi.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // OTP-ni yenidən göndərmə funksiyası
    const resendOtp = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post('/auth/resend-otp', { email });
            return { success: true, message: res.data.message || 'Yeni doğrulama kodu göndərildi.' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Kodu yenidən göndərərkən xəta baş verdi.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Şifrə sıfırlama e-poçtu göndərmə funksiyası
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post('/auth/forgot-password', { email });
            return { success: true, message: res.data.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Şifrə sıfırlama e-poçtu göndərilərkən xəta baş verdi.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Şifrəni token ilə sıfırlama funksiyası
    const resetPassword = async (token, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.put(`/auth/reset-password/${token}`, { password });
            return { success: true, message: res.data.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Şifrə sıfırlanarkən xəta baş verdi.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Xəta mesajını təmizləmək üçün funksiya
    const clearError = () => {
        setError(null);
    };

    // Kontekst dəyərlərini uşaq komponentlərinə ötürürük.
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                register,
                login,
                logout,
                verifyEmail,
                resendOtp,
                forgotPassword,
                resetPassword,
                clearError,
                API,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};