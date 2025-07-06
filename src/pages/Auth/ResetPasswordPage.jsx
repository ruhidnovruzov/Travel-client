// frontend/src/pages/Auth/ResetPasswordPage.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { resetPassword, loading, error, clearError } = useContext(AuthContext);
    const { token } = useParams(); // URL-dən tokeni al
    const navigate = useNavigate();

    useEffect(() => {
        clearError(); // Səhifə yüklənəndə xətaları təmizlə
        setMessage('');
    }, [clearError]);

    const submitHandler = async (e) => {
        e.preventDefault();
        clearError();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Şifrələr uyğun gəlmir!');
            return;
        }

        if (password.length < 6) {
            setMessage('Şifrə minimum 6 simvol olmalıdır.');
            return;
        }

        const res = await resetPassword(token, password);
        if (res.success) {
            setMessage(res.message);
            // Şifrə uğurla yeniləndikdən sonra istifadəçini daxil olma səhifəsinə yönləndir
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setMessage(res.message); // Xətanı göstər
        }
        // Mesaj 5 saniyə sonra təmizlənsin (əgər avtomatik yönləndirmə yoxdursa)
        if (!res.success) {
            setTimeout(() => {
                setMessage('');
                clearError();
            }, 5000);
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-indigo-300/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Şifrəni Sıfırla</h1>
                        <p className="text-gray-600">Yeni şifrənizi daxil edin.</p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                            error 
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                            {error ? (
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                            )}
                            <p className="font-medium">{message}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="mb-6 p-4 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
                            <p className="font-medium">Şifrə yenilənir...</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submitHandler} className="space-y-6">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Lock className="h-4 w-4 text-indigo-500" />
                                Yeni Şifrə
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Lock className="h-4 w-4 text-indigo-500" />
                                Şifrəni Təsdiqlə
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                            }`}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Lock className="h-5 w-5" />
                            )}
                            {loading ? 'Yenilənir...' : 'Şifrəni Yenilə'}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="text-center mt-8">
                        <Link 
                            to="/login" 
                            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                        >
                            Daxil Olma Səhifəsinə Qayıt
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
