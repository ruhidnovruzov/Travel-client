// frontend/src/pages/Auth/VerifyEmailPage.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Key, Loader2, CheckCircle2, AlertCircle, Send, ArrowRight } from 'lucide-react';

const VerifyEmailPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [resendCooldown, setResendCooldown] = useState(60); // Saniyə
    const [isResending, setIsResending] = useState(false);

    const { verifyEmail, resendOtp, loading, user, error, clearError } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // RegisterPage-dən gələn state-i almaq üçün

    useEffect(() => {
        // RegisterPage-dən email-i al
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        } else if (user && !user.isVerified) {
            // Əgər istifadəçi daxil olubsa, lakin doğrulanmayıbsa, emailini doldur
            setEmail(user.email);
        } else if (user && user.isVerified) {
            // Əgər istifadəçi artıq doğrulanıbsa, ana səhifəyə yönləndir
            navigate('/');
        }
    }, [location.state, user, navigate]);

    useEffect(() => {
        // Xəta mesajlarını idarə et
        if (error) {
            setMessage(error);
            const timer = setTimeout(() => {
                clearError();
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    // Yenidən göndərmə sayğacı
    useEffect(() => {
        let timer;
        if (resendCooldown > 0 && isResending) {
            timer = setTimeout(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        } else if (resendCooldown === 0 && isResending) {
            setIsResending(false);
            setResendCooldown(60); // Sayğacı sıfırla
        }
        return () => clearTimeout(timer);
    }, [resendCooldown, isResending]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Mesajı təmizlə

        if (!email || !otp) {
            setMessage('Zəhmət olmasa email və doğrulama kodunu daxil edin.');
            return;
        }

        try {
            const res = await verifyEmail(email, otp);
            if (res.success) {
                setMessage(res.message);
                // Uğurlu doğrulamadan sonra ana səhifəyə yönləndir
                navigate('/');
            } else {
                setMessage(res.message || 'Doğrulama zamanı xəta baş verdi.');
            }
        } catch (err) {
            setMessage(err.message || 'Doğrulama zamanı gözlənilməz xəta baş verdi.');
        }
    };

    const handleResendOtp = async () => {
        setMessage(''); // Mesajı təmizlə
        if (!email) {
            setMessage('Zəhmət olmasa email adresinizi daxil edin.');
            return;
        }
        setIsResending(true);
        setResendCooldown(60); // Sayğacı başlat

        try {
            const res = await resendOtp(email);
            if (res.success) {
                setMessage(res.message);
            } else {
                setMessage(res.message || 'Kodu yenidən göndərərkən xəta baş verdi.');
            }
        } catch (err) {
            setMessage(err.message || 'Kodu yenidən göndərərkən gözlənilməz xəta baş verdi.');
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
                    {/* Header Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Emailinizi Doğrulayın</h2>
                        <p className="text-gray-600">Qeydiyyatı tamamlamaq üçün emailinizə göndərilən 6 rəqəmli kodu daxil edin.</p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                            message.includes('xəta') || message.includes('Yanlış') || message.includes('etibarsız')
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                            {message.includes('xəta') || message.includes('Yanlış') || message.includes('etibarsız') ? (
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                            )}
                            <p className="font-medium">{message}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl flex items-center gap-3 border border-blue-200">
                            <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
                            <p className="font-medium">Doğrulanır...</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field (read-only) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Mail className="h-4 w-4 text-indigo-500" />
                                Email Adresiniz
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Email dəyişməyə icazə veririk, əgər boş gəlsə istifadəçi daxil edə bilsin
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="email@example.com"
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* OTP Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Key className="h-4 w-4 text-blue-500" />
                                Doğrulama Kodu (OTP)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="6 rəqəmli kodu daxil edin"
                                    maxLength={6}
                                    required
                                />
                                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Doğrulanır...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5" />
                                    Kodu Doğrula
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend OTP */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-2">Kodu almadınız?</p>
                        <button
                            onClick={handleResendOtp}
                            disabled={isResending || loading}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 mx-auto
                                ${isResending 
                                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                                }`}
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Yenidən göndərilir ({resendCooldown}s)
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Kodu Yenidən Göndər
                                </>
                            )}
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            <Link 
                                to="/login" 
                                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all duration-300 hover:underline"
                            >
                                Daxil Olma Səhifəsinə Qayıt
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Decorative Element */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-lg rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 font-medium">Email Doğrulaması Tələb Olunur</span>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
