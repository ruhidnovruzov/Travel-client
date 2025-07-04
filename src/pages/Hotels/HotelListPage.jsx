import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import hotelService from '../../services/hotelService.js';
import useDebounce from '../../hooks/useDebounce.js';

const HotelListPage = () => {
    const [hotels, setHotels] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Filter state-ləri
    const [filterCity, setFilterCity] = useState(searchParams.get('city') || '');
    const [filterCheckInDate, setFilterCheckInDate] = useState(searchParams.get('checkInDate') || '');
    const [filterCheckOutDate, setFilterCheckOutDate] = useState(searchParams.get('checkOutDate') || '');
    const [filterGuests, setFilterGuests] = useState(parseInt(searchParams.get('guests')) || 1);
    const [filterRooms, setFilterRooms] = useState(parseInt(searchParams.get('rooms')) || 1);
    const [filterMinPrice, setFilterMinPrice] = useState(searchParams.get('minPrice') || '');
    const [filterMaxPrice, setFilterMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [filterStars, setFilterStars] = useState(searchParams.get('stars') || '');
    const [filterAmenities, setFilterAmenities] = useState(searchParams.get('amenities') || '');

    // Debounced dəyərlər
    const debouncedCity = useDebounce(filterCity, 500);
    const debouncedMinPrice = useDebounce(filterMinPrice, 500);
    const debouncedMaxPrice = useDebounce(filterMaxPrice, 500);
    const debouncedStars = useDebounce(filterStars, 500);
    const debouncedAmenities = useDebounce(filterAmenities, 500);

    // Şəhərləri yığmaq üçün yalnız bir dəfə bütün hotelləri çəkirik
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await hotelService.getHotels({});
                const cities = data.data.map(h => h.city).filter(Boolean);
                setCityOptions(Array.from(new Set(cities)));
            } catch (err) {
                setCityOptions([]);
            }
        };
        fetchCities();
    }, []);

    // Filterə uyğun hotelləri çək
    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            setError(null);
            try {
                const paramsToSend = {
                    city: debouncedCity,
                    minPrice: debouncedMinPrice,
                    maxPrice: debouncedMaxPrice,
                    amenities: debouncedAmenities,
                };
                if (debouncedStars) paramsToSend.stars = Number(debouncedStars);
                Object.keys(paramsToSend).forEach(key => {
                    if (!paramsToSend[key]) delete paramsToSend[key];
                });

                const data = await hotelService.getHotels(paramsToSend);
                setHotels(data.data);

                // URL-i də debounced dəyərlərlə yenilə
                const newSearchParams = new URLSearchParams();
                if (debouncedCity) newSearchParams.set('city', debouncedCity);
                if (filterCheckInDate) newSearchParams.set('checkInDate', filterCheckInDate);
                if (filterCheckOutDate) newSearchParams.set('checkOutDate', filterCheckOutDate);
                if (filterGuests) newSearchParams.set('guests', filterGuests);
                if (filterRooms) newSearchParams.set('rooms', filterRooms);
                if (debouncedMinPrice) newSearchParams.set('minPrice', debouncedMinPrice);
                if (debouncedMaxPrice) newSearchParams.set('maxPrice', debouncedMaxPrice);
                if (debouncedStars) newSearchParams.set('stars', debouncedStars);
                if (debouncedAmenities) newSearchParams.set('amenities', debouncedAmenities);
                setSearchParams(newSearchParams);

            } catch (err) {
                setError(err?.message || 'Hotellər yüklənmədi.');
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [
        debouncedCity,
        debouncedMinPrice,
        debouncedMaxPrice,
        debouncedStars,
        debouncedAmenities,
        filterCheckInDate,
        filterCheckOutDate,
        filterGuests,
        filterRooms,
        setSearchParams
    ]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams();
        if (filterCity) newSearchParams.set('city', filterCity);
        if (filterCheckInDate) newSearchParams.set('checkInDate', filterCheckInDate);
        if (filterCheckOutDate) newSearchParams.set('checkOutDate', filterCheckOutDate);
        if (filterGuests) newSearchParams.set('guests', filterGuests);
        if (filterRooms) newSearchParams.set('rooms', filterRooms);
        if (filterMinPrice) newSearchParams.set('minPrice', filterMinPrice);
        if (filterMaxPrice) newSearchParams.set('maxPrice', filterMaxPrice);
        if (filterStars) newSearchParams.set('stars', filterStars);
        if (filterAmenities) newSearchParams.set('amenities', filterAmenities);

        setSearchParams(newSearchParams);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
                <p className="text-xl text-purple-600">Hotellər yüklənir...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-red-50 p-4 rounded-lg shadow-md">
                <p className="text-xl text-red-700">Xəta: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Hotellər</h2>

            {/* Filter Forması */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Hotelləri Filtrlə</h3>
                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="filterCity" className="block text-gray-700 text-sm font-semibold mb-2">Şəhər:</label>
                        <select
                            id="filterCity"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            value={filterCity}
                            onChange={(e) => setFilterCity(e.target.value)}
                        >
                            <option value="">Bütün şəhərlər</option>
                            {cityOptions.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterCheckInDate" className="block text-gray-700 text-sm font-semibold mb-2">Giriş Tarixi:</label>
                        <input
                            type="date"
                            id="filterCheckInDate"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            value={filterCheckInDate}
                            onChange={(e) => setFilterCheckInDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="filterCheckOutDate" className="block text-gray-700 text-sm font-semibold mb-2">Çıxış Tarixi:</label>
                        <input
                            type="date"
                            id="filterCheckOutDate"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            value={filterCheckOutDate}
                            onChange={(e) => setFilterCheckOutDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="filterGuests" className="block text-gray-700 text-sm font-semibold mb-2">Qonaq Sayı:</label>
                        <input
                            type="number"
                            id="filterGuests"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            min="1"
                            value={filterGuests}
                            onChange={(e) => setFilterGuests(parseInt(e.target.value) || 1)}
                        />
                    </div>
                    <div>
                        <label htmlFor="filterRooms" className="block text-gray-700 text-sm font-semibold mb-2">Otaq Sayı:</label>
                        <input
                            type="number"
                            id="filterRooms"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            min="1"
                            value={filterRooms}
                            onChange={(e) => setFilterRooms(parseInt(e.target.value) || 1)}
                        />
                    </div>
                    <div>
                        <label htmlFor="filterMinPrice" className="block text-gray-700 text-sm font-semibold mb-2">Min. Qiymət:</label>
                        <input
                            type="number"
                            id="filterMinPrice"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            min="0"
                            value={filterMinPrice}
                            onChange={(e) => setFilterMinPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="filterMaxPrice" className="block text-gray-700 text-sm font-semibold mb-2">Maks. Qiymət:</label>
                        <input
                            type="number"
                            id="filterMaxPrice"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            min="0"
                            value={filterMaxPrice}
                            onChange={(e) => setFilterMaxPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="filterStars" className="block text-gray-700 text-sm font-semibold mb-2">Min. Ulduz:</label>
                        <select
                            id="filterStars"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            value={filterStars}
                            onChange={(e) => setFilterStars(e.target.value)}
                        >
                            <option value="">Bütün Ulduzlar</option>
                            <option value="1">1 Ulduz</option>
                            <option value="2">2 Ulduz</option>
                            <option value="3">3 Ulduz</option>
                            <option value="4">4 Ulduz</option>
                            <option value="5">5 Ulduz</option>
                        </select>
                    </div>
                    <div className="lg:col-span-4">
                        <label htmlFor="filterAmenities" className="block text-gray-700 text-sm font-semibold mb-2">Xidmətlər (vergüllə ayırın):</label>
                        <input
                            type="text"
                            id="filterAmenities"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            placeholder="Wi-Fi, Hovuz, Parkinq"
                            value={filterAmenities}
                            onChange={(e) => setFilterAmenities(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 lg:col-span-4 flex justify-center mt-4">
                        {/* <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
                        >
                            Filtrlə
                        </button> */}
                    </div>
                </form>
            </div>

            {/* Otel siyahısı */}
            {hotels.length === 0 ? (
                <p className="text-center text-xl text-gray-600">Axtarışınız üçün heç bir otel tapılmadı.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            {hotel.images && hotel.images.length > 0 && (
                                <img
                                    src={hotel.images[0]}
                                    alt={hotel.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/E0E0E0/333333?text=Hotel+Image'; }}
                                />
                            )}
                            <h3 className="text-2xl font-bold text-purple-700 mb-2">{hotel.name}</h3>
                            <p className="text-gray-700 mb-1">
                                <span className="font-semibold">Ünvan:</span> {hotel.address}, {hotel.city}, {hotel.country}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-semibold">Ulduz:</span> {hotel.stars} <span className="text-yellow-500">★</span>
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-semibold">Xidmətlər:</span> {hotel.amenities.join(', ') || 'Yoxdur'}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <span className="font-semibold">Ən Ucuz Qiymət:</span> ${hotel.cheapestPrice} / gecə
                            </p>
                            <Link
                                to={`/hotels/${hotel._id}?checkInDate=${filterCheckInDate}&checkOutDate=${filterCheckOutDate}&guests=${filterGuests}&rooms=${filterRooms}`}
                                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Detallara Bax
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HotelListPage;