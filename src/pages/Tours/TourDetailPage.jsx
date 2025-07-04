import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Users, Calendar, Clock, Mountain, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import tourService from '../../services/tourService.js';
import bookingService from '../../services/bookingService.js';
import { AuthContext } from '../../context/AuthContext.jsx';

const TourDetailPage = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);

    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [participants, setParticipants] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [bookingMessage, setBookingMessage] = useState(null);

    useEffect(() => {
        const fetchTour = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await tourService.getTourById(id);
                setTour(data.data);
                if (data.data.availableDates && data.data.availableDates.length > 0) {
                    setSelectedDate(new Date(data.data.availableDates[0]).toISOString().split('T')[0]);
                }
            } catch (err) {
                setError(err?.message || 'Xəta baş verdi.');
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            setBookingMessage({ type: 'error', text: 'Rezervasiya etmək üçün zəhmət olmasa daxil olun.' });
            return;
        }
        if (!tour || participants <= 0 || participants > tour.maxGroupSize || !selectedDate) {
            setBookingMessage({ type: 'error', text: 'Zəhmət olmasa düzgün iştirakçı sayı və tarix daxil edin.' });
            return;
        }
        setBookingMessage({ type: 'info', text: 'Rezervasiya edilir...' });
        try {
            const bookingData = {
                bookingType: 'tour',
                bookedItemId: tour._id,
                startDate: selectedDate,
                totalPrice: tour.price * participants,
                passengers: parseInt(participants),
            };
            const res = await bookingService.createBooking(bookingData);
            setBookingMessage({ type: 'success', text: res.message || 'Tur uğurla rezervasiya edildi!' });
            // Tur məlumatlarını yenidən yüklə
            const updatedTourData = await tourService.getTourById(id);
            setTour(updatedTourData.data);
        } catch (err) {
            setBookingMessage({ type: 'error', text: err?.message || 'Rezervasiya zamanı xəta baş verdi.' });
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 font-medium">Tur detalları yüklənir...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-200">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-red-700 text-center font-medium">Xəta: {error}</p>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 font-medium">Tur tapılmadı.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Hero Section */}
            <div className="relative">
                {tour.images && tour.images.length > 0 && (
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={tour.images[0]}
                            alt={tour.title}
                            className="w-full h-full object-cover"
                        />


                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                    {tour.title} 
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-white/90">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-5 w-5" />
                                        <span className="text-lg">{tour.city}, {tour.country}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-5 w-5" />
                                        <span className="text-lg">{tour.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Mountain className="h-5 w-5" />
                                        <span className="capitalize text-lg">{tour.difficulty}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-5 w-5" />
                                        <span className="text-lg">{tour.maxGroupSize} nəfər</span>
                                    </div>
                                    {tour.ratingsAverage > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                            <span className="text-lg">{tour.ratingsAverage.toFixed(1)} ({tour.ratingsQuantity} rəy)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Tour Info Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Tur Haqqında</h3>
                                <p className="text-gray-700 text-lg leading-relaxed">{tour.description}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Rezervasiya Məlumatları</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Tarix seçin:</span>
                                        <select
                                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
                                            value={selectedDate}
                                            onChange={e => setSelectedDate(e.target.value)}
                                            disabled={!tour.availableDates || tour.availableDates.length === 0}
                                        >
                                            {tour.availableDates && tour.availableDates.length > 0 ? (
                                                tour.availableDates.map(date => (
                                                    <option key={date} value={new Date(date).toISOString().split('T')[0]}>
                                                        {new Date(date).toLocaleDateString()}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Mövcud tarix yoxdur</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">İştirakçı sayı:</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={tour.maxGroupSize}
                                            className="ml-2 w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
                                            value={participants}
                                            onChange={e => setParticipants(e.target.value)}
                                            disabled={!user || !selectedDate || tour.maxGroupSize === 0}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mountain className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Çətinlik: <span className="capitalize font-medium">{tour.difficulty}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Müddət: <span className="font-medium">{tour.duration}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-5 w-5 text-emerald-600" />
                                        <span className="text-gray-700">Maksimum qrup: <span className="font-medium">{tour.maxGroupSize}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl text-center">
                                <p className="text-gray-700 text-lg mb-2">Qiymət</p>
                                <p className="text-4xl font-bold text-emerald-600">${tour.price}</p>
                                <p className="text-gray-600">nəfər başına</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">Rezervasiya Təsdiqi</h3>
                        <div className="flex justify-center items-center gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">İştirakçı sayı</p>
                                <p className="text-xl font-bold text-emerald-600">{participants}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Ümumi Qiymət</p>
                                <p className="text-xl font-bold text-green-600">
                                    ${(tour.price * participants).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleBooking}
                            disabled={!user || !selectedDate || participants <= 0 || participants > tour.maxGroupSize}
                            className={`
                                px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                                ${!user || !selectedDate || participants <= 0 || participants > tour.maxGroupSize
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
                                }
                            `}
                        >
                            {user ? 'Turu Rezervasiya Et' : 'Daxil Olun'}
                        </button>
                        {bookingMessage && (
                            <div className={`
                                p-4 rounded-xl flex items-center justify-center gap-3
                                ${bookingMessage.type === 'error' ? 'bg-red-50 text-red-700' :
                                    bookingMessage.type === 'success' ? 'bg-green-50 text-green-700' :
                                        'bg-blue-50 text-blue-700'}
                            `}>
                                {bookingMessage.type === 'error' && <AlertCircle className="h-5 w-5" />}
                                {bookingMessage.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                                {bookingMessage.type === 'info' && <Loader2 className="h-5 w-5 animate-spin" />}
                                <p className="font-medium">{bookingMessage.text}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetailPage;