import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const { user, loading, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [updateStatus, setUpdateStatus] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
        if (user) {
            setForm({ name: user.name, email: user.email, password: '' });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-6 text-white text-xl font-medium">
                    Yüklənir...
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateStatus('loading');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                'http://localhost:5000/api/users/profile',
                {
                    name: form.name,
                    email: form.email,
                    password: form.password ? form.password : undefined,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.data && res.data.success) {
                setUpdateStatus('success');
                setEditMode(false);
                setForm({ ...form, password: '' });
                setUser && setUser(res.data.data);
            } else {
                setUpdateStatus(res.data.message || 'Xəta baş verdi.');
            }
        } catch (err) {
            setUpdateStatus(
                err.response?.data?.message || 'Xəta baş verdi.'
            );
        }
    };

    return (
        <div className="min-h-screen pt-14 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-md">
                    {/* Welcome Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Xoş gəlmişsiniz, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">{user.name}!</span>
                        </h1>
                        <p className="text-purple-200 text-lg">Profil məlumatlarınızı idarə edin</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                        {!editMode ? (
                            <>
                                {/* Profile Display */}
                                <div className="space-y-6 mb-8">
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <label className="block text-purple-200 text-sm font-medium mb-1">Ad</label>
                                            <p className="text-white text-lg font-semibold">{user.name}</p>
                                        </div>

                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <label className="block text-purple-200 text-sm font-medium mb-1">Email</label>
                                            <p className="text-white text-lg font-semibold">{user.email}</p>
                                        </div>

                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <label className="block text-purple-200 text-sm font-medium mb-1">Rol</label>
                                            <p className="text-white text-lg font-semibold capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setEditMode(true)}
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                >
                                    Profili Redaktə Et
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Edit Form */}
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-white mb-2">Profili Redaktə Et</h2>
                                        <p className="text-purple-200">Məlumatlarınızı yeniləyin</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-purple-200 text-sm font-medium mb-2">Ad</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-purple-200 text-sm font-medium mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-purple-200 text-sm font-medium mb-2">Yeni Şifrə (istəyə bağlı)</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Yeni şifrə daxil edin"
                                            />
                                        </div>
                                    </div>

                                    {/* Status Messages */}
                                    {updateStatus === 'loading' && (
                                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 text-center">
                                            <p className="text-blue-200 font-medium">Yenilənir...</p>
                                        </div>
                                    )}
                                    {updateStatus === 'success' && (
                                        <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                                            <p className="text-green-200 font-medium">✓ Profil uğurla yeniləndi!</p>
                                        </div>
                                    )}
                                    {updateStatus && updateStatus !== 'loading' && updateStatus !== 'success' && (
                                        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-center">
                                            <p className="text-red-200 font-medium">⚠ {updateStatus}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={updateStatus === 'loading'}
                                        >
                                            Yadda Saxla
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditMode(false);
                                                setForm({ name: user.name, email: user.email, password: '' });
                                                setUpdateStatus(null);
                                            }}
                                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={updateStatus === 'loading'}
                                        >
                                            Ləğv Et
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;