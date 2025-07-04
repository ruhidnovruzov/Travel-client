import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Users, Star, Filter, Loader2, AlertCircle, Mountain, Calendar, DollarSign } from 'lucide-react';
import tourService from '../../services/tourService';
import useDebounce from '../../hooks/useDebounce';

const TourListPage = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Filter input state-ləri
    const [cityInput, setCityInput] = useState(searchParams.get('city') || '');
    const [countryInput, setCountryInput] = useState(searchParams.get('country') || '');
    const [minPriceInput, setMinPriceInput] = useState(searchParams.get('minPrice') || '');
    const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get('maxPrice') || '');
    const [durationInput, setDurationInput] = useState(searchParams.get('duration') || '');
    const [difficultyInput, setDifficultyInput] = useState(searchParams.get('difficulty') || '');
    const [cityOptions, setCityOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    // Debounced dəyərlər
    const debouncedCity = useDebounce(cityInput, 500);
    const debouncedCountry = useDebounce(countryInput, 500);
    const debouncedMinPrice = useDebounce(minPriceInput, 500);
    const debouncedMaxPrice = useDebounce(maxPriceInput, 500);
    const debouncedDuration = useDebounce(durationInput, 500);
    const debouncedDifficulty = useDebounce(difficultyInput, 500);

    // Filter parametrləri obyekti (memoizasiya)
    const filters = useMemo(() => ({
        city: debouncedCity,
        country: debouncedCountry,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        duration: debouncedDuration,
        difficulty: debouncedDifficulty,
    }), [
        debouncedCity,
        debouncedCountry,
        debouncedMinPrice,
        debouncedMaxPrice,
        debouncedDuration,
        debouncedDifficulty
    ]);

    // URL-ni filtrlərə uyğun yeniləyən funksiya
    useEffect(() => {
        const newSearchParams = new URLSearchParams();

        if (filters.city) newSearchParams.set('city', filters.city);
        if (filters.country) newSearchParams.set('country', filters.country);
        if (filters.minPrice) newSearchParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice) newSearchParams.set('maxPrice', filters.maxPrice);
        if (filters.duration) newSearchParams.set('duration', filters.duration);
        if (filters.difficulty) newSearchParams.set('difficulty', filters.difficulty);

        // Əgər URL dəyişibsa yenilə
        const newUrl = newSearchParams.toString();
        const currentUrl = [...searchParams].map(([k, v]) => `${k}=${v}`).join('&');

        if (newUrl !== currentUrl) {
            setSearchParams(newSearchParams);
        }
    }, [filters, searchParams, setSearchParams]);

    // Turları yükləyən funksiya
    const fetchTours = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const paramsToSend = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value) paramsToSend[key] = value;
            });

            const data = await tourService.getTours(paramsToSend);
            setTours(data.data);

            // Unikal şəhər və ölkə siyahısı çıxar
            const cities = Array.from(new Set(data.data.map(t => t.city).filter(Boolean)));
            const countries = Array.from(new Set(data.data.map(t => t.country).filter(Boolean)));
            setCityOptions(cities);
            setCountryOptions(countries);
        } catch (err) {
            setError(err.message || 'Xəta baş verdi');
        } finally {
            setLoading(false);
        }
    }, [filters]);
    // Fetch effekti - yalnız filtrlər dəyişdikdə
    useEffect(() => {
        fetchTours();
    }, [fetchTours]);

    // Form submit handler (enter basmaqla işləyir)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Submit edərkən inputlar artıq debounce olduğu üçün heç nə etməyə ehtiyac yoxdur
    };

    // Difficulty badge rəngi
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Difficulty icon
    const getDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'easy': return '🟢';
            case 'medium': return '🟡';
            case 'hard': return '🔴';
            default: return '⚪';
        }
    };

    // Tur kartlarını render edən komponent (memoized)
    const TourCard = useCallback(({ tour }) => (
        <div className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
            <div className="relative overflow-hidden">
                {tour.images && tour.images.length > 0 ? (
                    <img
                        src={tour.images[0]}
                        alt={tour.title}
                        loading="lazy"
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                        }}
                    />
                ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                        <Mountain className="h-16 w-16 text-white opacity-50" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(tour.difficulty)}`}>
                        {getDifficultyIcon(tour.difficulty)} {tour.difficulty}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                        {tour.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm">{tour.city}, {tour.country}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-600">{tour.maxGroupSize} nəfər</span>
                    </div>
                </div>

                {tour.ratingsAverage > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(tour.ratingsAverage) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {tour.ratingsAverage.toFixed(1)} ({tour.ratingsQuantity} rəy)
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600">${tour.price}</p>
                        <p className="text-sm text-gray-500">nəfər başına</p>
                    </div>
                    <Link
                        to={`/tours/${tour._id}`}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Detallara Bax
                    </Link>
                </div>
            </div>
        </div>
    ), []);

    // Loading UI
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 font-medium">Turlar yüklənir...</p>
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
        <div className="min-h-screen pt-16 md:pt-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Hero Section */}
       <section className="relative min-h-[60vh]  flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        'url("https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
                }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/70 via-teal-700/60 to-cyan-700/60" />
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse" />
            <div className="absolute top-32 right-20 w-16 h-16 bg-emerald-500/20 rounded-full blur-sm animate-pulse delay-700" />
            <div className="absolute bottom-32 left-20 w-24 h-24 bg-teal-500/20 rounded-full blur-sm animate-pulse delay-500" />
            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
                <div className="text-center text-white mb-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg">
                        Unudulmaz
                        <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Macəra Turları
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
                        Dünyanın ən gözəl yerlərini kəşf edin və unudulmaz təcrübələr yaşayın.
                    </p>
                </div>
            </div>
        </section>
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {/* Filter Section */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-12 border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                        <Filter className="h-6 w-6 text-emerald-600" />
                        <h3 className="text-2xl font-bold text-gray-800">Turları Filtrlə</h3>
                    </div>

                    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                Şəhər
                            </label>
                            <select
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
                            >
                                <option value="">Bütün</option>
                                {cityOptions.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <MapPin className="h-4 w-4 text-teal-500" />
                                Ölkə
                            </label>
                            <select
                                value={countryInput}
                                onChange={(e) => setCountryInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
                            >
                                <option value="">Bütün</option>
                                {countryOptions.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                Min. Qiymət
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={minPriceInput}
                                onChange={(e) => setMinPriceInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                Maks. Qiymət
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={maxPriceInput}
                                onChange={(e) => setMaxPriceInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Clock className="h-4 w-4 text-blue-500" />
                                Müddət
                            </label>
                            <input
                                type="text"
                                placeholder="3 gün"
                                value={durationInput}
                                onChange={(e) => setDurationInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Mountain className="h-4 w-4 text-purple-500" />
                                Çətinlik
                            </label>
                            <select
                                value={difficultyInput}
                                onChange={(e) => setDifficultyInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
                            >
                                <option value="">Bütün</option>
                                <option value="easy">🟢 Asan</option>
                                <option value="medium">🟡 Orta</option>
                                <option value="hard">🔴 Çətin</option>
                            </select>
                        </div>

                        <div className="xl:col-span-6 flex justify-center mt-6">
                            <button
                                type="submit"
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <Search className="h-5 w-5" />
                                Turları Axtar
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {tours.length > 0 ? `${tours.length} Tur Tapıldı` : 'Heç bir tur tapılmadı'}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
                    </div>

                    {tours.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center border border-white/20">
                            <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-xl text-gray-600">Axtarış kriteriyalarınıza uyğun tur tapılmadı.</p>
                            <p className="text-gray-500 mt-2">Filtrlərinizdə dəyişiklik edərək yenidən cəhd edin.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tours.map(tour => (
                                <TourCard key={tour._id} tour={tour} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourListPage;