// frontend/src/context/AuthContext.js

import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// 1. AuthContext-i yarat
export const AuthContext = createContext();

// 2. Initial State (başlanğıc vəziyyət)
const initialState = {
    user: null,         // Daxil olmuş istifadəçi məlumatları
    token: null,        // JWT token
    loading: true,      // Yükləmə vəziyyəti (API çağırışları zamanı)
    error: null         // Xəta mesajı
};

// 3. Auth Reducer funksiyası
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case 'AUTH_FAIL':
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'USER_LOADED':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case 'LOAD_USER_ERROR':
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

// 4. AuthProvider komponenti
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Axios instansiyasını yarat və çərəzlərin göndərilməsini təmin et
    const API = axios.create({
        baseURL: 'http://localhost:5000/api', // Backend API-nizin əsas URL-i
        withCredentials: true, // Çərəzləri avtomatik göndər və qəbul et
    });

    // İstifadəçini yüklə (səhifə yenilənəndə və ya tətbiq başlayanda)
    useEffect(() => {
        const loadUser = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (token && user) {
                try {
                    // Backenddən tokeni doğrulat
                    const res = await API.get('/auth/me'); // Backenddəki getMe endpointi
                    dispatch({
                        type: 'USER_LOADED',
                        payload: { user: res.data.data, token },
                    });
                } catch (err) {
                    dispatch({ type: 'LOAD_USER_ERROR', payload: err.response?.data?.message || 'Token etibarsızdır.' });
                }
            } else {
                dispatch({ type: 'LOAD_USER_ERROR', payload: null }); // Heç bir istifadəçi yoxdur, sadəcə yüklənməni bitir
            }
        };

        loadUser();
    }, []); // Yalnız komponent mount olanda işə düşsün

    // Qeydiyyat funksiyası
    const register = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await API.post('/auth/register', userData);
            dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
            return { success: true, message: 'Qeydiyyat uğurludur!' };
        } catch (err) {
            dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi.' });
            return { success: false, message: err.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi.' };
        }
    };

    // Daxil olma funksiyası
    const login = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await API.post('/auth/login', userData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            return { success: true, message: 'Daxil olma uğurludur!' };
        } catch (err) {
            dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Daxil olma zamanı xəta baş verdi.' });
            return { success: false, message: err.response?.data?.message || 'Daxil olma zamanı xəta baş verdi.' };
        }
    };

    // Çıxış funksiyası
    const logout = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await API.get('/auth/logout'); // Backend-ə logout sorğusu göndər
            dispatch({ type: 'LOGOUT' });
            return { success: true, message: 'Sistemdən uğurla çıxış edildi.' };
        } catch (err) {
            console.error("Logout error:", err);
            dispatch({ type: 'LOGOUT' }); // Xəta olsa belə lokal state-i təmizlə
            return { success: false, message: 'Çıxış zamanı xəta baş verdi.' };
        }
    };

    // Xəta mesajını təmizləmək üçün
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <AuthContext.Provider value={{ ...state, register, login, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};