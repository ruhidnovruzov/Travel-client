import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Plane, ArrowRight, Filter, Star, Clock, TrendingUp, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FlightSearchPage = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [allFlights, setAllFlights] = useState([]);
    const [origins, setOrigins] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();

    // Fetch all flights once for select options
    useEffect(() => {
        const fetchAllFlights = async () => {
            try {
                const res = await fetch('https://travel-back-5euo.onrender.com/api/flights');
                const data = await res.json();
                if (data.success) {
                    setAllFlights(data.data);
                    // Unique origins and destinations
                    const uniqueOrigins = [...new Set(data.data.map(f => f.origin))];
                    const uniqueDestinations = [...new Set(data.data.map(f => f.destination))];
                    setOrigins(uniqueOrigins);
                    setDestinations(uniqueDestinations);
                }
            } catch (err) {
                // ignore for selects
            }
        };
        fetchAllFlights();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFlights([]);
        try {
            const params = new URLSearchParams({
                origin,
                destination,
                departureDate,
            });
            const res = await fetch(`https://travel-back-5euo.onrender.com/api/flights?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setFlights(data.data);
            } else {
                setError('Uçuş tapılmadı.');
            }
        } catch (err) {
            setError('Xəta baş verdi.');
        } finally {
            setLoading(false);
        }
    };

    const popularDestinations = [
        { city: 'İstanbul', country: 'Türkiyə', price: '₼120', icon: <MapPin className="h-8 w-8 text-blue-400" /> },
        { city: 'Dubai', country: 'BƏA', price: '₼280', icon: <Star className="h-8 w-8 text-yellow-400" /> },
        { city: 'Moskva', country: 'Rusiya', price: '₼180', icon: <Clock className="h-8 w-8 text-red-400" /> },
        { city: 'Paris', country: 'Fransa', price: '₼350', icon: <TrendingUp className="h-8 w-8 text-green-400" /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800">
            {/* Header Navigation */}
            <nav className="bg-white/10 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-500 p-2 rounded-lg">
                                <Plane className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white text-xl font-bold">Travel Booking</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="/" className="text-white/90 hover:text-white transition-colors">Ana Səhifə</a>
                            <a href="/bookings" className="text-white/90 hover:text-white transition-colors">Rezervasiyalarım</a>
                            <a href="/#services" className="text-white/90 hover:text-white transition-colors">Xidmətlər</a>
                            <a href="/about" className="text-white/90 hover:text-white transition-colors">Haqqımızda</a>
                            <a href="/contact" className="text-white/90 hover:text-white transition-colors">Əlaqə</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-white">
                                <User className="h-5 w-5" />
                                <span className="hidden sm:block">Profil (Ruhid)</span>
                            </div>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                                <LogOut className="h-4 w-4" />
                                <span>Çıxış</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Səyahət
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                            Dünyasına
                        </span>
                        Xoş Gəlmisiniz
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Uçuş, hotel və avtomobil rezervasyonu üçün ən etibarlı platformaya xoş gəlmisiniz.
                        Dünyada hər yerə səyahət edin, xatirələrinizi yaradın.
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 mb-16">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Origin */}
                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">Gediş Şəhəri</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm appearance-none"
                                        value={origin}
                                        onChange={e => setOrigin(e.target.value)}
                                        required
                                    >
                                        <option value="">Şəhər seçin</option>
                                        {origins.map((city, idx) => (
                                            <option key={city + idx} value={city} className="bg-gray-800 text-white">
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">Çatış Şəhəri</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm appearance-none"
                                        value={destination}
                                        onChange={e => setDestination(e.target.value)}
                                        required
                                    >
                                        <option value="">Şəhər seçin</option>
                                        {destinations.map((city, idx) => (
                                            <option key={city + idx} value={city} className="bg-gray-800 text-white">
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Departure Date */}
                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">Gediş Tarixi</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                                        value={departureDate}
                                        onChange={(e) => setDepartureDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Passengers */}
                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">Sərnişin Sayı</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm appearance-none"
                                        value={passengers}
                                        onChange={(e) => setPassengers(e.target.value)}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <option key={num} value={num} className="bg-gray-800 text-white">
                                                {num} Sərnişin
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                            <Search className="h-5 w-5" />
                            <span>Uçuş Axtar</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>
                </div>

                {/* Uçuş nəticələri */}
                <div className="mb-16">
                    {loading && (
                        <div className="text-center text-white text-xl py-8">Yüklənir...</div>
                    )}
                    {error && (
                        <div className="text-center text-red-300 text-lg py-8">{error}</div>
                    )}
                    {!loading && flights.length > 0 && (
                        <div>
                            <h2 className="text-3xl font-bold text-white text-center mb-8">Axtarış Nəticələri</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {flights.map((flight) => (
                                    <div
                                        key={flight._id}
                                        className="bg-white/20 rounded-2xl p-6 shadow-lg text-white cursor-pointer hover:bg-white/30 transition"
                                        onClick={() => navigate(`/flights/${flight._id}`)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-lg">{flight.airline}</span>
                                            <span className="text-sm">{flight.flightNumber}</span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <Plane className="mr-2" />
                                            <span>{flight.origin} <ArrowRight className="inline mx-1" /> {flight.destination}</span>
                                        </div>
                                        <div className="mb-2">
                                            <Calendar className="inline mr-1" />
                                            {new Date(flight.departureTime).toLocaleString()} - {new Date(flight.arrivalTime).toLocaleString()}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Qiymət:</span> <span className="text-green-300 font-bold">{flight.price} ₼</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Yerlər:</span> {flight.availableSeats} / {flight.totalSeats}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Popular Destinations */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Populyar Təyinatlara</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularDestinations.map((dest, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group hover:scale-105"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-all duration-300">
                                        {dest.icon}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-white text-sm">dan başlayır</span>
                                        <div className="text-2xl font-bold text-white">{dest.price}</div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{dest.city}</h3>
                                <p className="text-white/70 text-sm">{dest.country}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            <div className="text-4xl font-bold text-white mb-2">10M+</div>
                            <div className="text-white/70">Məmnun Müştəri</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            <div className="text-4xl font-bold text-white mb-2">500+</div>
                            <div className="text-white/70">Təyinat</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            <div className="text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-white/70">Dəstək</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightSearchPage;