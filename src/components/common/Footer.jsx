import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plane, Hotel, Map, Car, ClipboardList, HelpCircle, Phone, MessageCircle, FileText, Lock, RotateCcw, Facebook, Instagram, Twitter, Linkedin, Youtube, Music, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        const footerElement = document.getElementById('main-footer');
        if (footerElement) observer.observe(footerElement);
        return () => {
            if (footerElement) observer.unobserve(footerElement);
        };
    }, []);

    const quickLinks = [
        { path: '/', label: 'Ana Səhifə', icon: <Home size={18} /> },
        { path: '/flights', label: 'Uçuşlar', icon: <Plane size={18} /> },
        { path: '/hotels', label: 'Hotellər', icon: <Hotel size={18} /> },
        { path: '/tours', label: 'Turlar', icon: <Map size={18} /> },
        { path: '/cars', label: 'Avtomobil İcarəsi', icon: <Car size={18} /> },
        { path: '/bookings', label: 'Rezervasiyonlarım', icon: <ClipboardList size={18} /> }
    ];

    const supportLinks = [
        { path: '/help', label: 'Kömək Mərkəzi', icon: <HelpCircle size={18} /> },
        { path: '/contact', label: 'Əlaqə', icon: <Phone size={18} /> },
        { path: '/faq', label: 'Tez-tez soruşulan suallar', icon: <MessageCircle size={18} /> },
        { path: '/terms', label: 'İstifadə şərtləri', icon: <FileText size={18} /> },
        { path: '/privacy', label: 'Məxfilik siyasəti', icon: <Lock size={18} /> },
        { path: '/cancellation', label: 'Ləğv siyasəti', icon: <RotateCcw size={18} /> }
    ];

    const socialLinks = [
        { url: 'https://facebook.com', label: 'Facebook', icon: <Facebook size={20} />, color: 'hover:text-blue-500' },
        { url: 'https://instagram.com', label: 'Instagram', icon: <Instagram size={20} />, color: 'hover:text-pink-500' },
        { url: 'https://twitter.com', label: 'Twitter', icon: <Twitter size={20} />, color: 'hover:text-sky-500' },
        { url: 'https://linkedin.com', label: 'LinkedIn', icon: <Linkedin size={20} />, color: 'hover:text-blue-700' },
        { url: 'https://youtube.com', label: 'YouTube', icon: <Youtube size={20} />, color: 'hover:text-red-600' },
        { url: 'https://tiktok.com', label: 'TikTok', icon: <Music size={20} />, color: 'hover:text-black' }
    ];

    const contactInfo = [
        { type: 'phone', value: '+994 12 345 67 89', label: 'Telefon', icon: <Phone size={18} />, action: 'tel:+994123456789' },
        { type: 'email', value: 'info@travelbooking.az', label: 'Email', icon: <Mail size={18} />, action: 'mailto:info@travelbooking.az' },
        { type: 'address', value: 'Bakı, Azərbaycan', label: 'Ünvan', icon: <MapPin size={18} /> },
        { type: 'hours', value: '24/7 Xidmət', label: 'İş saatları', icon: <Clock size={18} /> }
    ];

    return (
        <footer
            id="main-footer"
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-10 pb-4"
        >
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-700/50">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Plane className="h-7 w-7 text-blue-400 mr-2" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Travel Booking</span>
                        </div>
                        <p className="text-gray-300 mb-4 text-sm">
                            Dünyanın hər yerində ən yaxşı qiymətlərlə uçuş, hotel, tur və avtomobil kirayə xidmətləri təqdim edirik.
                        </p>
                        <div className="flex space-x-6 mt-6">
                            <div className="text-center">
                                <div className="text-lg font-bold text-blue-400">1M+</div>
                                <div className="text-xs text-gray-400">Müştəri</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-400">500K+</div>
                                <div className="text-xs text-gray-400">Rezervasiya</div>
                            </div>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                            <ClipboardList className="mr-2 h-5 w-5" /> Sürətli Linklər
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                                    >
                                        {link.icon}
                                        <span className="text-sm">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Support Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                            <HelpCircle className="mr-2 h-5 w-5" /> Dəstək
                        </h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                                    >
                                        {link.icon}
                                        <span className="text-sm">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                            <Phone className="mr-2 h-5 w-5" /> Əlaqə
                        </h4>
                        <ul className="space-y-3">
                            {contactInfo.map((info) => (
                                <li key={info.type}>
                                    {info.action ? (
                                        <a
                                            href={info.action}
                                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                                        >
                                            {info.icon}
                                            <span className="text-sm">{info.value}</span>
                                        </a>
                                    ) : (
                                        <div className="flex items-center space-x-2 text-gray-300">
                                            {info.icon}
                                            <span className="text-sm">{info.value}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Social Media */}
                <div className="flex flex-wrap justify-center gap-4 mt-8 mb-6">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition ${social.color}`}
                            aria-label={social.label}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm pt-4 border-t border-gray-700/50">
                    <div className="mb-2 md:mb-0">
                        © {currentYear}TravelAZ. Bütün hüquqlar qorunur.
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                            <Lock size={14} /> <span>SSL Təhlükəsiz</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <ClipboardList size={14} /> <span>Sertifikatlı</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Plane size={14} /> <span>Keyfiyyət Təminatı</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;