import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx'; // Fayl uzantısı əlavə edildi
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // AuthContext-dən register funksiyasını, xəta, yüklənmə statusunu və istifadəçi məlumatını alırıq
    const { register, error, loading, user, clearError } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Əgər istifadəçi artıq daxil olubsa və doğrulanıbsa ana səhifəyə yönləndir
        if (user && user.isVerified) {
            navigate('/');
        }
        // Xəta mesajlarını idarə et
        if (error) {
            setMessage(error);
            const timer = setTimeout(() => {
                clearError();
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [user, error, navigate, clearError]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(''); // Hər göndərişdə mesajı təmizlə

        if (password !== confirmPassword) {
            setMessage('Şifrələr uyğun gəlmir!');
            return;
        }

        try {
            // register funksiyası API cavabını qaytarmalıdır
            const res = await register({ name, email, password });

            if (res.success) {
                setMessage(res.message);
                // Qeydiyyat uğurlu olduqdan sonra doğrulama səhifəsinə yönləndir
                // Email adresini state olaraq ötürürük ki, doğrulama səhifəsində istifadə olunsun
                navigate('/verify-email', { state: { email: email } });
            } else {
                // Backend-dən gələn xəta mesajını göstər
                setMessage(res.message || 'Qeydiyyat zamanı xəta baş verdi.');
            }
        } catch (err) {
            // Şəbəkə xətası və ya digər gözlənilməz xətalar
            setMessage(err.message || 'Qeydiyyat zamanı gözlənilməz xəta baş verdi.');
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
                            <UserPlus className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Qeydiyyat</h2>
                        <p className="text-gray-600">Yeni hesab yaradın və macəraya başlayın</p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                            message.includes('Xəta') || message.includes('uyğun gəlmir') || message.includes('baş verdi')
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                            {message.includes('Xəta') || message.includes('uyğun gəlmir') || message.includes('baş verdi') ? (
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
                            <p className="font-medium">Hesab yaradılır...</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submitHandler} className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <User className="h-4 w-4 text-purple-500" />
                                Ad Soyad
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="Adınızı daxil edin"
                                    required
                                />
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Mail className="h-4 w-4 text-indigo-500" />
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="email@example.com"
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Lock className="h-4 w-4 text-blue-500" />
                                Şifrə
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="Güclü şifrə yaradın"
                                    required
                                />
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Lock className="h-4 w-4 text-green-500" />
                                Şifrəni Təkrarla
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="Şifrəni təkrar daxil edin"
                                    required
                                />
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
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
                                    Hesab Yaradılır...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    Qeydiyyatdan Keç
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Artıq hesabınız var?{' '}
                            <Link 
                                to="/login" 
                                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all duration-300 hover:underline"
                            >
                                Daxil Ol
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Decorative Element */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-lg rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 font-medium">Güvənli və Sürətli Qeydiyyat</span>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
