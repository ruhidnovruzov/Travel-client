import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance (withCredentials true və render.com URL üçün uyğun)
  const API = axios.create({
    baseURL: 'https://gunay-travel.onrender.com/api', // Render URL
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  // Token varsa istifadəçini fetch et
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/auth/me');
        setUser(res.data.data);
      } catch (err) {
        console.error('User fetch error:', err.response?.data?.message);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/register', userData);
      return { success: true, message: res.data.message, user: res.data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/login', credentials);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      return { success: true, message: 'Uğurla daxil oldunuz.' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Daxil olma zamanı xəta baş verdi.';
      setError(msg);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.get('/auth/logout');
    } catch (err) {
      // ignore error
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/verify-email', { email, otp });
      setUser(res.data.user);
      return { success: true, message: res.data.message || 'Email doğrulandı' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Doğrulama zamanı xəta baş verdi.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/resend-otp', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Kodu yenidən göndərmək mümkün olmadı.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Şifrə sıfırlama zamanı xəta baş verdi.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetToken, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.put(`/auth/reset-password/${resetToken}`, { password });
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Şifrə yenilənərkən xəta baş verdi.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

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
