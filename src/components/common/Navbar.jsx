import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X, Plane, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    // Scroll Effekti
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Çıxış Fonksiyası
    const handleLogout = async () => {
        const res = await logout();
        if (res.success) {
            navigate('/login');
            alert(res.message);
        } else {
            alert(res.message);
        }
    };

    // Mobil Menü Açma-Kapatma
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Dropdown Açma-Kapatma
    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    // Navbar Linkləri
    const navLinks = [
        { to: '/', text: 'Ana Səhifə' },
        { to: '/bookings', text: 'Rezervasiyonlarım' },
        {
            text: 'Xidmətlər',
            subItems: [
                { to: '/flights', text: 'Uçuşlar' },
                { to: '/hotels', text: 'Hotellər' },
                { to: '/tours', text: 'Turlar' },
                { to: '/cars', text: 'Avtomobil İcarəsi' }
            ]
        },
        { to: '/about', text: 'Haqqımızda' },
        { to: '/contact', text: 'Əlaqə' }
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
                ? 'bg-white/90 backdrop-blur-lg shadow-2xl border-b border-white/20'
                : 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900'
            }`}>
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x opacity-50"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                            }`}>
                            <Plane className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-blue-300'
                                }`} />
                        </div>
                        <Link
                            to="/"
                            className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300 ${isScrolled ? 'from-slate-800 to-purple-800' : ''
                                }`}
                        >
                            TravelAZ
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link, index) => (
                            link.subItems ? (
                                <div key={index} className="relative group">
                                    <button
                                        onClick={() => toggleDropdown(link.text)}
                                        className={`px-4 py-2 flex items-center gap-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform ${isScrolled
                                                ? 'text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600'
                                                : 'text-white/90 hover:text-white hover:bg-white/20'
                                            } backdrop-blur-sm border border-transparent hover:border-white/30 hover:shadow-lg`}
                                    >
                                        {link.text}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <div className={`absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${openDropdown === link.text ? 'opacity-100 visible' : ''
                                        }`}>
                                        {link.subItems.map((sub, i) => (
                                            <Link
                                                key={i}
                                                to={sub.to}
                                                className="block px-4 py-2 text-slate-800 hover:bg-purple-100/80 rounded-md transition"
                                            >
                                                {sub.text}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform ${isScrolled
                                            ? 'text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600'
                                            : 'text-white/90 hover:text-white hover:bg-white/20'
                                        } backdrop-blur-sm border border-transparent hover:border-white/30 hover:shadow-lg`}
                                >
                                    {link.text}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* User Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/profile"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform ${isScrolled
                                            ? 'text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500'
                                            : 'text-white/90 hover:text-white hover:bg-white/20'
                                        } backdrop-blur-sm border border-transparent hover:border-white/30 hover:shadow-lg`}
                                >
                                    <User className="w-4 h-4" />
                                    <span>Profil ({user.name})</span>
                                </Link>
                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Çıxış</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform ${isScrolled
                                            ? 'text-slate-700 border border-slate-300 hover:bg-slate-100'
                                            : 'text-white border border-white/30 hover:bg-white/10'
                                        } hover:shadow-lg`}
                                >
                                    Daxil Ol
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
                                >
                                    Qeydiyyat
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className={`p-2 rounded-full transition-all duration-300 ${isScrolled
                                    ? 'text-slate-700 hover:bg-slate-100'
                                    : 'text-white hover:bg-white/20'
                                }`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="py-4 space-y-2 bg-white/10 backdrop-blur-lg rounded-xl mt-4 mb-4 border border-white/20">
                        {navLinks.map((link, index) => (
                            link.subItems ? (
                                <div key={index}>
                                    <button
                                        onClick={() => toggleDropdown(link.text)}
                                        className="flex justify-between items-center w-full px-6 py-3 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-lg"
                                    >
                                        <span>{link.text}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.text ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`pl-6 overflow-hidden transition-all duration-300 ${openDropdown === link.text ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        {link.subItems.map((sub, i) => (
                                            <Link
                                                key={i}
                                                to={sub.to}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-6 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg"
                                            >
                                                {sub.text}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-6 py-3 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-lg"
                                >
                                    {link.text}
                                </Link>
                            )
                        ))}

                        <div className="px-4 py-2 border-t border-white/20 mt-4">
                            {user ? (
                                <div className="space-y-2">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center space-x-2 px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-lg"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profil ({user.name})</span>
                                    </Link>
                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 text-yellow-300 font-semibold hover:bg-white/20 transition-all duration-300 rounded-lg"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-2 w-full px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-300 rounded-lg"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Çıxış</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-center text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300"
                                    >
                                        Daxil Ol
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition-all duration-300"
                                    >
                                        Qeydiyyat
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom border animation */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'
                }`}></div>
        </nav>
    );
};

export default Navbar;