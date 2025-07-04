import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Car, Users, MapPin, Calendar, DollarSign, Fuel, Settings, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import carService from '../../services/carService.js';
import bookingService from '../../services/bookingService.js';
import { AuthContext } from '../../context/AuthContext.jsx';

const CarDetailPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { user, loading: authLoading } = useContext(AuthContext);

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingMessage, setBookingMessage] = useState(null);

    const [rentalStartDate, setRentalStartDate] = useState(searchParams.get('startDate') || '');
    const [rentalEndDate, setRentalEndDate] = useState(searchParams.get('endDate') || '');

    // Helper: all dates in range
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate).toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const calculateRentalDays = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const rentalDays = calculateRentalDays(rentalStartDate, rentalEndDate);
    const totalPrice = car ? car.dailyRate * rentalDays : 0;

    useEffect(() => {
        const fetchCar = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await carService.getCarById(id);
                setCar(data.data);
            } catch (err) {
                setError(err?.message || 'Xəta baş verdi');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const isCarAvailableForDates = (car, start, end) => {
        if (!car || !start || !end) return false;
        const datesToCheck = getDatesInRange(new Date(start), new Date(end));
        return datesToCheck.every(date =>
            !car.unavailableDates.map(d => new Date(d).toISOString().split('T')[0]).includes(date)
        );
    };

    const handleBooking = async () => {
        if (!user) {
            setBookingMessage({ type: 'error', text: 'İcarə etmək üçün zəhmət olmasa daxil olun.' });
            return;
        }
        if (!car || !rentalStartDate || !rentalEndDate || rentalDays <= 0) {
            setBookingMessage({ type: 'error', text: 'Zəhmət olmasa düzgün icarə tarixləri daxil edin.' });
            return;
        }
        if (!isCarAvailableForDates(car, rentalStartDate, rentalEndDate)) {
            setBookingMessage({ type: 'error', text: 'Seçilmiş tarixlərdə bu avtomobil mövcud deyil.' });
            return;
        }

        setBookingMessage({ type: 'info', text: 'İcarə edilir...' });

        try {
            const bookingData = {
                bookingType: 'car',
                bookedItemId: car._id,
                startDate: rentalStartDate,
                endDate: rentalEndDate,
                totalPrice: totalPrice,
                passengers: 1,
            };
            const res = await bookingService.createBooking(bookingData);
            setBookingMessage({ type: 'success', text: res.message || 'Avtomobil uğurla icarə edildi!' });
            // Refresh car data
            const updatedCarData = await carService.getCarById(id);
            setCar(updatedCarData.data);
        } catch (err) {
            setBookingMessage({ type: 'error', text: err?.message || 'İcarə zamanı xəta baş verdi.' });
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 font-medium">Avtomobil detalları yüklənir...</p>
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

    if (!car) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 font-medium">Avtomobil tapılmadı.</p>
                </div>
            </div>
        );
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
            {/* Hero Section */}
            <div className="relative">
                {car.images && car.images.length > 0 && (
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/1000x400/E0E0E0/333333?text=Car+Image'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                    {car.brand} {car.model} <span className="text-3xl font-medium text-orange-200">({car.year})</span>
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-white/90">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-5 w-5" />
                                        <span className="text-lg">{car.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-5 w-5" />
                                        <span className="text-lg">{car.seats} yer</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Settings className="h-5 w-5" />
                                        <span className="capitalize text-lg">{car.transmission}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Fuel className="h-5 w-5" />
                                        <span className="capitalize text-lg">{car.fuelType}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-5 w-5" />
                                        <span className="text-lg text-orange-200">${car.dailyRate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Car Info Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Avtomobil Haqqında</h3>
                                <div className="text-gray-700 text-lg leading-relaxed space-y-2">
                                    <p><span className="font-semibold">Marka:</span> {car.brand}</p>
                                    <p><span className="font-semibold">Model:</span> {car.model}</p>
                                    <p><span className="font-semibold">İl:</span> {car.year}</p>
                                    <p><span className="font-semibold">Nömrə Nişanı:</span> {car.licensePlate}</p>
                                    <p><span className="font-semibold">Yanacaq Növü:</span> <span className="capitalize">{car.fuelType}</span></p>
                                    <p><span className="font-semibold">Transmissiya:</span> <span className="capitalize">{car.transmission}</span></p>
                                    <p><span className="font-semibold">Yer Sayı:</span> {car.seats}</p>
                                    <p><span className="font-semibold">Məkan:</span> {car.location}</p>
                                    <p className="mt-4">{car.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">İcarə Məlumatları</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                        <span className="text-gray-700">Götürmə tarixi:</span>
                                        <input
                                            type="date"
                                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                                            value={rentalStartDate}
                                            onChange={e => setRentalStartDate(e.target.value)}
                                            min={today}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                        <span className="text-gray-700">Qaytarma tarixi:</span>
                                        <input
                                            type="date"
                                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                                            value={rentalEndDate}
                                            onChange={e => setRentalEndDate(e.target.value)}
                                            min={rentalStartDate || today}
                                            required
                                        />
                                    </div>
                                    {rentalStartDate && rentalEndDate && rentalDays <= 0 && (
                                        <p className="text-red-500 text-sm mt-2">Qaytarma tarixi götürmə tarixindən sonra olmalıdır.</p>
                                    )}
                                    {rentalDays > 0 && (
                                        <p className="text-gray-700 text-lg mt-2">
                                            <span className="font-semibold">İcarə Günləri:</span> {rentalDays} gün
                                        </p>
                                    )}
                                    {!isCarAvailableForDates(car, rentalStartDate, rentalEndDate) && rentalStartDate && rentalEndDate && rentalDays > 0 && (
                                        <p className="text-red-500 text-sm mt-2">Seçilmiş tarixlərdə bu avtomobil mövcud deyil.</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl text-center">
                                <p className="text-gray-700 text-lg mb-2">Günlük Qiymət</p>
                                <p className="text-4xl font-bold text-orange-600">${car.dailyRate}</p>
                                <p className="text-gray-600">gün başına</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">İcarə Təsdiqi</h3>
                        <div className="flex justify-center items-center gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">İcarə Günləri</p>
                                <p className="text-xl font-bold text-amber-600">{rentalDays}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Ümumi Qiymət</p>
                                <p className="text-xl font-bold text-green-600">
                                    ${totalPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleBooking}
                            disabled={!user || !rentalStartDate || !rentalEndDate || rentalDays <= 0 || !isCarAvailableForDates(car, rentalStartDate, rentalEndDate)}
                            className={`
                                px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                                ${!user || !rentalStartDate || !rentalEndDate || rentalDays <= 0 || !isCarAvailableForDates(car, rentalStartDate, rentalEndDate)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl'
                                }
                            `}
                        >
                            {user ? 'Avtomobili İcarə Et' : 'Daxil Olun'}
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
export default CarDetailPage;