import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Star, MapPin, Users, Calendar, Clock, Bed, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import hotelService from '../../services/hotelService.js';
import bookingService from '../../services/bookingService.js';
import { AuthContext } from '../../context/AuthContext.jsx';

const HotelDetailPage = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, loading: authLoading } = useContext(AuthContext);

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingMessage, setBookingMessage] = useState(null);
    const [selectedRoomNumbers, setSelectedRoomNumbers] = useState({});

    // Local state for form if query params are missing
    const [localCheckInDate, setLocalCheckInDate] = useState('');
    const [localCheckOutDate, setLocalCheckOutDate] = useState('');
    const [localGuests, setLocalGuests] = useState(1);
    const [localRooms, setLocalRooms] = useState(1);

    // Use query params if available, otherwise use local state
    const checkInDate = searchParams.get('checkInDate') || localCheckInDate;
    const checkOutDate = searchParams.get('checkOutDate') || localCheckOutDate;
    const guests = parseInt(searchParams.get('guests')) || localGuests;
    const numRooms = parseInt(searchParams.get('rooms')) || localRooms;

    // Helper to get all dates in range
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate).toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const datesToBook = checkInDate && checkOutDate ? getDatesInRange(new Date(checkInDate), new Date(checkOutDate)) : [];
    const numberOfNights = datesToBook.length > 0 ? datesToBook.length - 1 : 0;

    // Show form if query params are missing
    const showFilterForm = !searchParams.get('checkInDate') || !searchParams.get('checkOutDate');

    useEffect(() => {
        const fetchHotelAndRooms = async () => {
            setLoading(true);
            setError(null);
            try {
                const hotelData = await hotelService.getHotelById(id);
                setHotel(hotelData.data);

                const roomsData = await hotelService.getHotelRooms(id);
                const availableRooms = roomsData.data.map(room => {
                    const availableRoomNumbers = room.roomNumbers.filter(roomNum => {
                        return datesToBook.every(date =>
                            !roomNum.unavailableDates.map(d => new Date(d).toISOString().split('T')[0]).includes(date)
                        );
                    });
                    return { ...room, availableRoomNumbers };
                });
                setRooms(availableRooms);

            } catch (err) {
                setError(err?.message || 'Xəta baş verdi.');
            } finally {
                setLoading(false);
            }
        };

        if (checkInDate && checkOutDate) {
            fetchHotelAndRooms();
        } else {
            const fetchHotel = async () => {
                setLoading(true);
                setError(null);
                try {
                    const hotelData = await hotelService.getHotelById(id);
                    setHotel(hotelData.data);
                } catch (err) {
                    setError(err?.message || 'Xəta baş verdi.');
                } finally {
                    setLoading(false);
                }
            };
            fetchHotel();
        }
    }, [id, checkInDate, checkOutDate]);

    const handleRoomNumberSelect = (roomId, roomNumber, isChecked) => {
        setSelectedRoomNumbers(prev => {
            const newSelection = { ...prev };
            if (isChecked) {
                if (!newSelection[roomId]) {
                    newSelection[roomId] = [];
                }
                newSelection[roomId].push(roomNumber);
            } else {
                newSelection[roomId] = newSelection[roomId].filter(num => num !== roomNumber);
                if (newSelection[roomId].length === 0) {
                    delete newSelection[roomId];
                }
            }
            return newSelection;
        });
    };

    const handleBooking = async () => {
        if (!user) {
            setBookingMessage({ type: 'error', text: 'Rezervasiya etmək üçün zəhmət olmasa daxil olun.' });
            return;
        }

        const selectedRoomsCount = Object.values(selectedRoomNumbers).flat().length;
        if (selectedRoomsCount === 0 || selectedRoomsCount !== numRooms) {
            setBookingMessage({ type: 'error', text: `Zəhmət olmasa ${numRooms} otaq seçin.` });
            return;
        }

        setBookingMessage({ type: 'info', text: 'Rezervasiya edilir...' });

        try {
            for (const roomId in selectedRoomNumbers) {
                for (const roomNumber of selectedRoomNumbers[roomId]) {
                    const roomInfo = rooms.find(r => r._id === roomId);
                    if (!roomInfo) continue;

                    const bookingData = {
                        bookingType: 'hotel',
                        bookedItemId: hotel._id,
                        roomId: roomId,
                        roomNumber: roomNumber,
                        startDate: checkInDate,
                        endDate: checkOutDate,
                        totalPrice: roomInfo.price * numberOfNights,
                        passengers: guests,
                    };
                    await bookingService.createBooking(bookingData);
                }
            }
            setBookingMessage({ type: 'success', text: 'Otaq(lar) uğurla rezervasiya edildi!' });
            // Refresh data
            if (checkInDate && checkOutDate) {
                const roomsData = await hotelService.getHotelRooms(id);
                const availableRooms = roomsData.data.map(room => {
                    const availableRoomNumbers = room.roomNumbers.filter(roomNum => {
                        return datesToBook.every(date =>
                            !roomNum.unavailableDates.map(d => new Date(d).toISOString().split('T')[0]).includes(date)
                        );
                    });
                    return { ...room, availableRoomNumbers };
                });
                setRooms(availableRooms);
            }
            setSelectedRoomNumbers({});
        } catch (err) {
            setBookingMessage({ type: 'error', text: err?.message || 'Rezervasiya zamanı xəta baş verdi.' });
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 font-medium">Otel məlumatları yüklənir...</p>
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

    if (!hotel) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 font-medium">Otel tapılmadı.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="relative">
                {hotel.images && hotel.images.length > 0 && (
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                    {hotel.name}
                                </h1>
                                <div className="flex items-center gap-4 text-white/90">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-5 w-5" />
                                        <span className="text-lg">{hotel.address}, {hotel.city}, {hotel.country}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(hotel.stars)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hotel Info Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Otel Haqqında</h3>
                                <p className="text-gray-700 text-lg leading-relaxed">{hotel.description}</p>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                                <h4 className="text-xl font-bold text-gray-800 mb-3">Xidmətlər</h4>
                                <div className="flex flex-wrap gap-2">
                                    {hotel.amenities.map((amenity, index) => (
                                        <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Rezervasiya Məlumatları</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-700">Giriş: <span className="font-medium">{checkInDate}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-700">Çıxış: <span className="font-medium">{checkOutDate}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-700">Qonaq: <span className="font-medium">{guests}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Bed className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-700">Otaq: <span className="font-medium">{numRooms}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-700">Gecə: <span className="font-medium">{numberOfNights}</span></span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl text-center">
                                <p className="text-gray-700 text-lg mb-2">Ən Ucuz Qiymət</p>
                                <p className="text-4xl font-bold text-orange-600">${hotel.cheapestPrice}</p>
                                <p className="text-gray-600">gecə başına</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Form */}
{showFilterForm && (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Rezervasiya Məlumatlarını Daxil Edin</h3>
        <form
            onSubmit={e => {
                e.preventDefault();
                setSearchParams({
                    checkInDate: localCheckInDate,
                    checkOutDate: localCheckOutDate,
                    guests: localGuests,
                    rooms: localRooms
                });
                setSelectedRoomNumbers({});
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Giriş Tarixi</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={localCheckInDate}
                                    onChange={e => setLocalCheckInDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Çıxış Tarixi</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={localCheckOutDate}
                                    onChange={e => setLocalCheckOutDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Qonaq Sayı</label>
                                <input
                                    type="number"
                                    min={1}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={localGuests}
                                    onChange={e => setLocalGuests(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Otaq Sayı</label>
                                <input
                                    type="number"
                                    min={1}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={localRooms}
                                    onChange={e => setLocalRooms(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="lg:col-span-4 flex justify-center mt-4">
                                <button
                                    type="submit"
                                    className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Otaqları Göstər
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Rooms Section */}
                {checkInDate && checkOutDate && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Mövcud Otaqlar</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl text-gray-600">Bu tarixlərdə mövcud otaq tapılmadı.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {rooms.map((room) => (
                                    <div key={room._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Bed className="h-6 w-6 text-indigo-600" />
                                                <h4 className="text-xl font-bold text-gray-800">{room.title}</h4>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-4 leading-relaxed">{room.desc}</p>
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-gray-500" />
                                                    <span className="text-sm text-gray-600">Maks. {room.maxPeople} nəfər</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-green-600">${room.price}</p>
                                                    <p className="text-sm text-gray-500">gecə başına</p>
                                                </div>
                                            </div>

                                            {room.availableRoomNumbers.length > 0 ? (
                                                <div className="space-y-4">
                                                    <p className="font-medium text-gray-800">Mövcud Otaq Nömrələri:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {room.availableRoomNumbers.map(roomNum => (
                                                            <label key={roomNum.number} className={`
                                                                flex items-center px-4 py-2 rounded-full cursor-pointer transition-all duration-200
                                                                ${selectedRoomNumbers[room._id]?.includes(roomNum.number) 
                                                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }
                                                                ${Object.values(selectedRoomNumbers).flat().length >= numRooms && 
                                                                  !selectedRoomNumbers[room._id]?.includes(roomNum.number) 
                                                                    ? 'opacity-50 cursor-not-allowed' 
                                                                    : ''
                                                                }
                                                            `}>
                                                                <input
                                                                    type="checkbox"
                                                                    value={roomNum.number}
                                                                    checked={selectedRoomNumbers[room._id]?.includes(roomNum.number) || false}
                                                                    onChange={(e) => handleRoomNumberSelect(room._id, roomNum.number, e.target.checked)}
                                                                    className="sr-only"
                                                                    disabled={
                                                                        Object.values(selectedRoomNumbers).flat().length >= numRooms &&
                                                                        !selectedRoomNumbers[room._id]?.includes(roomNum.number)
                                                                    }
                                                                />
                                                                <span className="font-medium">{roomNum.number}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                                    <p className="text-red-600 font-medium">Bu otaq növü üçün mövcud otaq yoxdur</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Booking Section */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="text-center space-y-6">
                                <h3 className="text-2xl font-bold text-gray-800">Rezervasiya Təsdiqi</h3>
                                
                                <div className="flex justify-center items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Seçilmiş Otaqlar</p>
                                        <p className="text-xl font-bold text-indigo-600">{Object.values(selectedRoomNumbers).flat().length}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Ümumi Qiymət</p>
                                        <p className="text-xl font-bold text-green-600">
                                            ${(Object.values(selectedRoomNumbers).flat().reduce((sum, num) => {
                                                const roomId = Object.keys(selectedRoomNumbers).find(key => selectedRoomNumbers[key].includes(num));
                                                const roomInfo = rooms.find(r => r._id === roomId);
                                                return sum + (roomInfo ? roomInfo.price : 0);
                                            }, 0) * numberOfNights).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={!user || Object.values(selectedRoomNumbers).flat().length !== numRooms || numberOfNights === 0}
                                    className={`
                                        px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                                        ${!user || Object.values(selectedRoomNumbers).flat().length !== numRooms || numberOfNights === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                                        }
                                    `}
                                >
                                    {user ? 'Rezervasiya Et' : 'Daxil Olun'}
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
                )}
            </div>
        </div>
    );
};

export default HotelDetailPage;