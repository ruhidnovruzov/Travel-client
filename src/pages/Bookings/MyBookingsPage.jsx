import React, { useState, useEffect, useContext } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Plane,
  Hotel,
  Car,
  MapPin,
  CreditCard,
  Trash2,
  Eye,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

import { AuthContext } from '../../context/AuthContext.jsx'; 
import bookingService from '../../services/bookingService.js'; 
import { useNavigate, useNavigate as useRouterNavigate } from 'react-router-dom';

const MyBookingsPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data.data);
      } catch (err) {
        setError(err?.message || 'Xəta baş verdi.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyBookings();
    }
  }, [user, authLoading, navigate]);

  const handleCancelBookingClick = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowConfirmModal(true);
  };

  const confirmCancelBooking = async () => {
    setShowConfirmModal(false);
    setMessage(null);
    try {
      const res = await bookingService.cancelBooking(bookingToCancel);
      setMessage({ type: 'success', text: res.message || 'Rezervasiya uğurla ləğv edildi.' });
      const data = await bookingService.getMyBookings();
      setBookings(data.data);
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Rezervasiyanı ləğv edərkən xəta baş verdi.' });
    } finally {
      setBookingToCancel(null);
    }
  };

  const cancelCancelBooking = () => {
    setShowConfirmModal(false);
    setBookingToCancel(null);
  };

  const getBookingIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'car': return Car;
      case 'tour': return MapPin;
      default: return MapPin;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'from-green-500 to-emerald-500';
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'cancelled': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return AlertCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const itemName = booking.bookedItem?.name || booking.bookedItem?.title || booking.bookedItem?.airline || '';
    const itemBrandModel = (booking.bookedItem?.brand && booking.bookedItem?.model) ? `${booking.bookedItem.brand} ${booking.bookedItem.model}` : '';

    const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          itemBrandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.bookingType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.bookingType.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Ətraflı bax düyməsi üçün yönləndirmə
  const handleDetailsClick = (booking) => {
    if (booking.bookingType.toLowerCase() === 'car') {
      navigate(`/cars/${booking.bookedItem._id}`);
    } else if (booking.bookingType.toLowerCase() === 'hotel') {
      navigate(`/hotels/${booking.bookedItem._id}`);
    } else if (booking.bookingType.toLowerCase() === 'tour') {
      navigate(`/tours/${booking.bookedItem._id}`);
    } else if (booking.bookingType.toLowerCase() === 'flight') {
      navigate(`/flights/${booking.bookedItem._id}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <RefreshCw className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xl text-gray-600 font-medium">Rezervasiyalar yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Xəta Baş Verdi</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Mənim Rezervasiyalarım
              </h1>
              <p className="text-gray-600 text-lg">
                Bütün səyahət rezervasiyalarınızı bir yerdə idarə edin
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
                <div className="text-2xl font-bold">{bookings.length}</div>
                <div className="text-sm opacity-90">Ümumi</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white text-center">
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm opacity-90">Təsdiqlənmiş</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-4 text-white text-center">
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm opacity-90">Gözləyən</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-4 rounded-xl border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-700' 
              : 'bg-red-50 border-red-500 text-red-700'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rezervasiya axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">Bütün Statuslar</option>
                <option value="confirmed">Təsdiqlənmiş</option>
                <option value="pending">Gözləyən</option>
                <option value="cancelled">Ləğv Edilmiş</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">Bütün Növlər</option>
                <option value="flight">Uçuş</option>
                <option value="hotel">Hotel</option>
                <option value="car">Avtomobil</option>
                <option value="tour">Tur</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium"
            >
              Filtri Təmizlə
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Rezervasiya Tapılmadı
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'Axtarış kriteriyalarına uyğun rezervasiya yoxdur.'
                  : 'Heç bir rezervasiyanız yoxdur.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const BookingIcon = getBookingIcon(booking.bookingType);
              const StatusIcon = getStatusIcon(booking.status);
              
              return (
                <div key={booking._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <BookingIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 capitalize">
                            {booking.bookingType} Rezervasiyası
                          </h3>
                          <p className="text-gray-500 text-sm">
                            ID: {booking._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusColor(booking.status)} text-white`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Main Info */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-start space-x-4">
                          {booking.bookedItem?.images?.[0] && (
                            <img
                              src={booking.bookedItem.images[0]}
                              alt="Booking"
                              className="w-20 h-20 rounded-xl object-cover"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/E0E0E0/333333?text=No+Image'; }}
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {booking.bookedItem?.name || 
                               booking.bookedItem?.airline || 
                               booking.bookedItem?.title || 
                               (booking.bookedItem?.brand && booking.bookedItem?.model ? 
                                 `${booking.bookedItem.brand} ${booking.bookedItem.model}` : 
                                 'Məlumat yoxdur')}
                            </h4>
                            
                            {booking.bookingType.toLowerCase() === 'hotel' && booking.room && (
                              <div className="flex items-center text-gray-600 mb-1">
                                <Hotel className="w-4 h-4 mr-2" />
                                <span>{booking.room.title} (Nömrə: {booking.roomNumber})</span>
                              </div>
                            )}
                            
                            <div className="flex items-center text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>Başlanğıc: {new Date(booking.startDate).toLocaleDateString()}</span>
                            </div>
                            
                            {(booking.bookingType.toLowerCase() === 'hotel' || booking.bookingType.toLowerCase() === 'car') && booking.endDate && (
                              <div className="flex items-center text-gray-600 mb-1">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>Bitmə: {new Date(booking.endDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            
                            {(booking.bookingType.toLowerCase() === 'flight' || booking.bookingType.toLowerCase() === 'tour') && (
                              <div className="flex items-center text-gray-600">
                                <Users className="w-4 h-4 mr-2" />
                                <span>Sərnişin/İştirakçı: {booking.passengers}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 font-medium">Ümumi Qiymət</span>
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            ${booking.totalPrice.toFixed(2)}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Ödəniş Statusu</span>
                            <CreditCard className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className={`font-bold text-lg ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </div>
                        </div>

                        {booking.status !== 'cancelled' && (
                          <div className="space-y-2">
                            <button
                              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
                              onClick={() => handleDetailsClick(booking)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ətraflı Bax
                            </button>
                            <button
                              onClick={() => handleCancelBookingClick(booking._id)}
                              className="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Ləğv Et
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Təsdiq Modalı */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-[#00000020] bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rezervasiyanı Ləğv Et</h3>
              <p className="text-gray-700 mb-6">Bu rezervasiyanı ləğv etmək istədiyinizə əminsinizmi? Bu əməliyyat geri qaytarıla bilməz.</p>
              <div className="flex justify-around">
                <button
                  onClick={confirmCancelBooking}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200"
                >
                  Bəli, Ləğv Et
                </button>
                <button
                  onClick={cancelCancelBooking}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200"
                >
                  Xeyr, Geri Qayıt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyBookingsPage;