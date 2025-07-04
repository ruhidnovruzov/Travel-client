import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import flightService from '../../services/flightService';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { Plane, ArrowRight, Calendar, Users, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const FlightDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passengers, setPassengers] = useState(1);
    const [bookingMessage, setBookingMessage] = useState(null);

    useEffect(() => {
        const fetchFlight = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await flightService.getFlightById(id);
                setFlight(data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlight();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            setBookingMessage({ type: 'error', text: 'Rezervasiya etmək üçün zəhmət olmasa daxil olun.' });
            return;
        }
        if (!flight || passengers <= 0 || passengers > flight.availableSeats) {
            setBookingMessage({ type: 'error', text: 'Zəhmət olmasa düzgün sərnişin sayı daxil edin.' });
            return;
        }

        setBookingMessage({ type: 'info', text: 'Rezervasiya edilir...' });

        try {
            const bookingData = {
                bookingType: 'flight',
                bookedItemId: flight._id,
                startDate: flight.departureTime,
                totalPrice: flight.price * passengers,
                passengers: parseInt(passengers),
            };
            const res = await bookingService.createBooking(bookingData);
            setBookingMessage({ type: 'success', text: res.message || 'Uçuş uğurla rezervasiya edildi!' });
            const updatedFlightData = await flightService.getFlightById(id);
            setFlight(updatedFlightData.data);
        } catch (err) {
            setBookingMessage({ type: 'error', text: err || 'Rezervasiya zamanı xəta baş verdi.' });
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                    <Plane className="w-12 h-12 text-blue-500 mb-4 animate-pulse" />
                    <p className="text-xl text-blue-700 font-semibold">Uçuş detalları yüklənir...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-red-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                    <XCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-xl text-red-700 font-semibold">Xəta: {error}</p>
                </div>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                    <XCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-xl text-gray-600 font-semibold">Uçuş tapılmadı.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container pt-20 mx-auto p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-[calc(100vh-64px)]">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 max-w-3xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-blue-500 rounded-xl p-4 mr-4">
                        <Plane className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
                        {flight.airline} <span className="text-blue-700">- {flight.flightNumber}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center text-lg text-gray-700">
                            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                            <span><span className="font-semibold">Gediş:</span> {flight.origin}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-700">
                            <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                            <span><span className="font-semibold">Çatış:</span> {flight.destination}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-700">
                            <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                            <span><span className="font-semibold">Gediş Vaxtı:</span> {new Date(flight.departureTime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-700">
                            <Calendar className="w-5 h-5 mr-2 text-indigo-400" />
                            <span><span className="font-semibold">Çatış Vaxtı:</span> {new Date(flight.arrivalTime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-700">
                            <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                            <span><span className="font-semibold">Müddət:</span> {flight.duration || 'Hesablanmadı'}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-700">
                            <ArrowRight className="w-5 h-5 mr-2 text-orange-500" />
                            <span><span className="font-semibold">Dayanacaqlar:</span> {flight.stops}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-700">
                            <CheckCircle className={`w-5 h-5 mr-2 ${flight.status === 'scheduled' ? 'text-blue-500' : flight.status === 'departed' ? 'text-green-500' : 'text-red-500'}`} />
                            <span>
                                <span className="font-semibold">Status:</span>{' '}
                                <span className={`font-bold ${flight.status === 'scheduled' ? 'text-blue-500' : flight.status === 'departed' ? 'text-green-500' : 'text-red-500'}`}>
                                    {flight.status}
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center text-lg text-gray-700">
                            <Users className="w-5 h-5 mr-2 text-indigo-500" />
                            <span><span className="font-semibold">Ümumi Yerlər:</span> {flight.totalSeats}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-700">
                            <Users className="w-5 h-5 mr-2 text-green-500" />
                            <span><span className="font-semibold">Mövcud Yerlər:</span> {flight.availableSeats}</span>
                        </div>
                        <div className="flex items-center text-3xl font-bold text-blue-600 mt-4">
                            <span>Qiymət: ${flight.price}</span>
                        </div>
                        <div className="text-gray-600 text-sm mt-1">Hər sərnişin üçün.</div>
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="passengers" className="block text-gray-700 text-sm font-semibold mb-2">Sərnişin Sayı:</label>
                        <input
                            type="number"
                            id="passengers"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            min="1"
                            max={flight.availableSeats}
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            disabled={!user || flight.availableSeats === 0}
                        />
                        {flight.availableSeats === 0 && <p className="text-red-500 text-sm mt-2">Bu uçuşda mövcud yer yoxdur.</p>}
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
                        <p className="text-2xl font-bold text-gray-800 mb-4">
                            Ümumi Qiymət: <span className="text-green-600">${(flight.price * passengers).toFixed(2)}</span>
                        </p>
                        <button
                            onClick={handleBooking}
                            disabled={!user || flight.availableSeats === 0 || passengers <= 0 || passengers > flight.availableSeats}
                            className={`w-full md:w-auto px-8 py-3 rounded-xl shadow-md text-white font-bold transition-all duration-300 transform hover:scale-105
                                ${!user || flight.availableSeats === 0 || passengers <= 0 || passengers > flight.availableSeats
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75'
                                }`}
                        >
                            {user ? 'Uçuşu Rezervasiya Et' : 'Daxil Olun (Rezervasiya üçün)'}
                        </button>
                        {bookingMessage && (
                            <p className={`mt-4 text-center text-lg font-semibold ${
                                bookingMessage.type === 'error'
                                    ? 'text-red-600'
                                    : bookingMessage.type === 'success'
                                    ? 'text-green-600'
                                    : 'text-blue-600'
                            }`}>
                                {bookingMessage.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightDetailPage;