import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Bed,
  ArrowRight,
  Sparkles,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { Link } from 'react-router-dom';

const HotelSearchPage = () => {
  const [city, setCity] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/hotels');
        const cities = res.data.data.map(h => h.city).filter(Boolean);
        setCityOptions(Array.from(new Set(cities)));
      } catch (err) {
        setCityOptions([]);
      }
    };
    fetchCities();
  }, []);

  // Debounced city value
  const debouncedCity = useDebounce(city, 500);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      city,
      checkInDate,
      checkOutDate,
      guests,
      rooms,
    }).toString();
    navigate(`/hotels/results?${queryParams}`);
  };

  // Fetch hotels from API (debounced)
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (debouncedCity) params.city = debouncedCity;
        const res = await axios.get('http://localhost:5000/api/hotels', { params });
        setHotels(res.data.data || []);
      } catch (err) {
        setError('Hotellər yüklənmədi.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [debouncedCity]);

  const popularDestinations = [
    { name: 'Bakı', image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { name: 'Qəbələ', image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { name: 'Şəki', image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { name: 'Gəncə', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' }
  ];

  const quickFilters = [
    { icon: Star, label: 'Lüks Hotellər', value: '5-star' },
    { icon: Sparkles, label: 'Spa & Wellness', value: 'spa' },
    { icon: Users, label: 'Ailə Dostu', value: 'family' },
    { icon: Clock, label: 'Son Dəqiqə', value: 'last-minute' }
  ];

  return (
    <div className="min-h-screen pt-16 md:pt-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-500/20 rounded-full blur-sm animate-pulse delay-700" />
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-sm animate-pulse delay-500" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <div className="text-center text-white mb-12">
            <h1 className="text-6xl mt-10 md:text-7xl font-black mb-4 leading-tight">
              Mükəmməl
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Hoteli
              </span>
              <span className="block text-4xl md:text-6xl font-light opacity-90">
                Tapın
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Dünyanın ən yaxşı hotellərində unudulmaz təcrübələr yaşayın.
              Komfort və lüks bir arada.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* City Input */}
                <div className="lg:col-span-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Şəhər və ya Hotel
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    >
                      <option value="">Şəhər seçin</option>
                      {cityOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    Giriş Tarixi
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-red-600" />
                    Çıxış Tarixi
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>

                {/* Guests and Rooms */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    Qonaq & Otaq
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full px-3 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        required
                      />
                      <Users className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full px-3 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                        min="1"
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                        required
                      />
                      <Bed className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <Search className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Hotel Axtar</span>
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Hotellər Listi */}
      <section className="py-16 bg-gray-50">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 md:mb-0">Hotellər</h2>
            <div className="flex items-center space-x-4">

            </div>
          </div>

          {/* Otellər Gridi */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-blue-600">Yüklənir...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Hotel tapılmadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-200"
                >
                  {/* Hotel Şəkli */}
                  <div className="relative">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        src={hotel.images[0]}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Şəkil yoxdur</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {hotel.stars} ★
                    </div>
                  </div>

                  {/* Məzmun */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 truncate">
                      {hotel.address}, {hotel.city}, {hotel.country}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities && hotel.amenities.length > 0 ? (
                        hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">Xidmətlər http://localhost:5000/</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-lg font-semibold text-gray-900">
                        {hotel.cheapestPrice} ₼ / gecə
                      </p>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition"
                      >
                        Ətraflı bax
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Populyar Təyinatlar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ən çox seçilən şəhərlərdə ən yaxşı hotelləri kəşf edin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setCity(destination.name)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-white/90">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">Azərbaycan</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Sürətli Seçimlər
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Xüsusi ehtiyaclarınıza uyğun hotelləri tapın
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickFilters.map((filter, index) => {
              const IconComponent = filter.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {filter.label}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Xüsusi seçimlər
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelSearchPage;