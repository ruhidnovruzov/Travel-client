// frontend/src/pages/Cars/CarListPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Users, Star, Filter, Loader2, AlertCircle, Car, Calendar, DollarSign, Fuel, Settings, Award } from 'lucide-react';
import carService from '../../services/carService.js';
import useDebounce from '../../hooks/useDebounce.js';

const CarListPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Filter sahələri üçün yerli state-lər
    const [brandInput, setBrandInput] = useState(searchParams.get('brand') || '');
    const [modelInput, setModelInput] = useState(searchParams.get('model') || '');
    const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
    const [minDailyRateInput, setMinDailyRateInput] = useState(searchParams.get('minDailyRate') || '');
    const [maxDailyRateInput, setMaxDailyRateInput] = useState(searchParams.get('maxDailyRate') || '');
    const [seatsInput, setSeatsInput] = useState(searchParams.get('seats') || '');
    const [transmissionInput, setTransmissionInput] = useState(searchParams.get('transmission') || '');
    const [startDateInput, setStartDateInput] = useState(searchParams.get('startDate') || '');
    const [endDateInput, setEndDateInput] = useState(searchParams.get('endDate') || '');

    // Debounced dəyərlər
    const debouncedBrand = useDebounce(brandInput, 500);
    const debouncedModel = useDebounce(modelInput, 500);
    const debouncedLocation = useDebounce(locationInput, 500);
    const debouncedMinDailyRate = useDebounce(minDailyRateInput, 500);
    const debouncedMaxDailyRate = useDebounce(maxDailyRateInput, 500);
    const debouncedSeats = useDebounce(seatsInput, 500);
    const debouncedTransmission = useDebounce(transmissionInput, 500);
    const debouncedStartDate = useDebounce(startDateInput, 500);
    const debouncedEndDate = useDebounce(endDateInput, 500);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            setError(null);
            try {
                const paramsToSend = {
                    brand: debouncedBrand,
                    model: debouncedModel,
                    location: debouncedLocation,
                    minDailyRate: debouncedMinDailyRate,
                    maxDailyRate: debouncedMaxDailyRate,
                    seats: debouncedSeats,
                    transmission: debouncedTransmission,
                    startDate: debouncedStartDate,
                    endDate: debouncedEndDate,
                };

                // Yalnız boş olmayan filterləri göndər
                Object.keys(paramsToSend).forEach(key => {
                    if (!paramsToSend[key]) {
                        delete paramsToSend[key];
                    }
                });

                const data = await carService.getCars(paramsToSend);
                setCars(data.data);

                // URL-i də debounced dəyərlərlə yenilə
                const newSearchParams = new URLSearchParams();
                if (debouncedBrand) newSearchParams.set('brand', debouncedBrand);
                if (debouncedModel) newSearchParams.set('model', debouncedModel);
                if (debouncedLocation) newSearchParams.set('location', debouncedLocation);
                if (debouncedMinDailyRate) newSearchParams.set('minDailyRate', debouncedMinDailyRate);
                if (debouncedMaxDailyRate) newSearchParams.set('maxDailyRate', debouncedMaxDailyRate);
                if (debouncedSeats) newSearchParams.set('seats', debouncedSeats);
                if (debouncedTransmission) newSearchParams.set('transmission', debouncedTransmission);
                if (debouncedStartDate) newSearchParams.set('startDate', debouncedStartDate);
                if (debouncedEndDate) newSearchParams.set('endDate', debouncedEndDate);
                setSearchParams(newSearchParams);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [debouncedBrand, debouncedModel, debouncedLocation, debouncedMinDailyRate, debouncedMaxDailyRate, debouncedSeats, debouncedTransmission, debouncedStartDate, debouncedEndDate, setSearchParams]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams();
        if (brandInput) newSearchParams.set('brand', brandInput);
        if (modelInput) newSearchParams.set('model', modelInput);
        if (locationInput) newSearchParams.set('location', locationInput);
        if (minDailyRateInput) newSearchParams.set('minDailyRate', minDailyRateInput);
        if (maxDailyRateInput) newSearchParams.set('maxDailyRate', maxDailyRateInput);
        if (seatsInput) newSearchParams.set('seats', seatsInput);
        if (transmissionInput) newSearchParams.set('transmission', transmissionInput);
        if (startDateInput) newSearchParams.set('startDate', startDateInput);
        if (endDateInput) newSearchParams.set('endDate', endDateInput);
        setSearchParams(newSearchParams);
    };

    // Transmissiya badge rəngi
    const getTransmissionColor = (transmission) => {
        switch (transmission) {
            case 'automatic': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'manual': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Transmissiya icon
    const getTransmissionIcon = (transmission) => {
        switch (transmission) {
            case 'automatic': return '🔵';
            case 'manual': return '🟠';
            default: return '⚪';
        }
    };

    // Loading UI
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 font-medium">Avtomobillər yüklənir...</p>
                </div>
            </div>
        );
    }

    // Error UI
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

    return (
        <div className="min-h-screen pt-16 md:pt-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            'url("https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse" />
                <div className="absolute top-32 right-20 w-16 h-16 bg-orange-500/20 rounded-full blur-sm animate-pulse delay-700" />
                <div className="absolute bottom-32 left-20 w-24 h-24 bg-red-500/20 rounded-full blur-sm animate-pulse delay-500" />
                {/* Content */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
                    <div className="text-center text-white mb-10">
                        <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg">
                            Premium
                            <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                                Avtomobil İcarəsi
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
                            Ən yaxşı avtomobilləri seçin və rahat səyahət edin.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 pb-12">
                {/* Filter Section */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-12 border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                        <Filter className="h-6 w-6 text-orange-600" />
                        <h3 className="text-2xl font-bold text-gray-800">Avtomobilləri Filtrlə</h3>
                    </div>

                    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Award className="h-4 w-4 text-orange-500" />
                                Marka
                            </label>
                            <input
                                type="text"
                                placeholder="Toyota, BMW, Mercedes..."
                                value={brandInput}
                                onChange={(e) => setBrandInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Car className="h-4 w-4 text-red-500" />
                                Model
                            </label>
                            <input
                                type="text"
                                placeholder="Camry, X5, E-Class..."
                                value={modelInput}
                                onChange={(e) => setModelInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <MapPin className="h-4 w-4 text-pink-500" />
                                Məkan
                            </label>
                            <input
                                type="text"
                                placeholder="Bakı Hava Limanı..."
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Users className="h-4 w-4 text-purple-500" />
                                Yer Sayı
                            </label>
                            <input
                                type="number"
                                min="1"
                                placeholder="2, 4, 5..."
                                value={seatsInput}
                                onChange={(e) => setSeatsInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                Min. Günlük Qiymət
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="50"
                                value={minDailyRateInput}
                                onChange={(e) => setMinDailyRateInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                Maks. Günlük Qiymət
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="500"
                                value={maxDailyRateInput}
                                onChange={(e) => setMaxDailyRateInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Settings className="h-4 w-4 text-blue-500" />
                                Transmissiya
                            </label>
                            <select
                                value={transmissionInput}
                                onChange={(e) => setTransmissionInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            >
                                <option value="">Bütün</option>
                                <option value="automatic">🔵 Avtomatik</option>
                                <option value="manual">🟠 Mexaniki</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Calendar className="h-4 w-4 text-indigo-500" />
                                Başlanğıc Tarixi
                            </label>
                            <input
                                type="date"
                                value={startDateInput}
                                onChange={(e) => setStartDateInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="xl:col-span-4 space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Calendar className="h-4 w-4 text-indigo-500" />
                                Bitmə Tarixi
                            </label>
                            <input
                                type="date"
                                value={endDateInput}
                                onChange={(e) => setEndDateInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="xl:col-span-4 flex justify-center mt-6">
                            <button
                                type="submit"
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <Search className="h-5 w-5" />
                                Avtomobil Axtar
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {cars.length > 0 ? `${cars.length} Avtomobil Tapıldı` : 'Heç bir avtomobil tapılmadı'}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                    </div>

                    {cars.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center border border-white/20">
                            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-xl text-gray-600">Axtarış kriteriyalarınıza uyğun avtomobil tapılmadı.</p>
                            <p className="text-gray-500 mt-2">Filtrlərinizdə dəyişiklik edərək yenidən cəhd edin.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cars.map((car) => (
                                <div key={car._id} className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                                    <div className="relative overflow-hidden">
                                        {car.images && car.images.length > 0 ? (
                                            <img
                                                src={car.images[0]}
                                                alt={`${car.brand} ${car.model}`}
                                                loading="lazy"
                                                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                                                <Car className="h-16 w-16 text-white opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTransmissionColor(car.transmission)}`}>
                                                {getTransmissionIcon(car.transmission)} {car.transmission}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                                                {car.brand} {car.model} ({car.year})
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-4 w-4 text-orange-500" />
                                                <span className="text-sm">{car.location}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-purple-500" />
                                                <span className="text-sm text-gray-600">{car.seats} yer</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Fuel className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-gray-600 capitalize">{car.fuelType}</span>
                                            </div>
                                        </div>

                                        <div className="text-gray-700 text-sm">
                                            <span className="font-semibold">Nömrə:</span> {car.licensePlate}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-orange-600">${car.dailyRate}</p>
                                                <p className="text-sm text-gray-500">gün başına</p>
                                            </div>
                                            <Link
                                                to={`/cars/${car._id}?startDate=${startDateInput}&endDate=${endDateInput}`}
                                                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                            >
                                                Detallara Bax
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarListPage;