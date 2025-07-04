// frontend/src/pages/Flights/FlightListPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import flightService from '../../services/flightService'; // Uçuş servisini import et

const FlightListPage = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams(); // URL query parametrlərini almaq üçün

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            setError(null);
            try {
                // URL query parametrlərini obyektə çevir
                const params = Object.fromEntries([...searchParams]);
                const data = await flightService.getFlights(params);
                setFlights(data.data); // Backend-dən gələn data.data
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]); // searchParams dəyişdikdə yenidən yüklə

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
                <p className="text-xl text-blue-600">Uçuşlar yüklənir...</p>
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
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Uçuş Nəticələri</h2>
            {flights.length === 0 ? (
                <p className="text-center text-xl text-gray-600">Axtarışınız üçün heç bir uçuş tapılmadı.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flights.map((flight) => (
                        <div key={flight._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <h3 className="text-2xl font-bold text-blue-700 mb-2">{flight.airline} - {flight.flightNumber}</h3>
                            <p className="text-gray-700 mb-1">
                                <span className="font-semibold">Gediş:</span> {flight.origin} ({new Date(flight.departureTime).toLocaleString()})
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-semibold">Çatış:</span> {flight.destination} ({new Date(flight.arrivalTime).toLocaleString()})
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-semibold">Müddət:</span> {flight.duration || 'Hesablanmadı'}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-semibold">Qiymət:</span> ${flight.price}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <span className="font-semibold">Mövcud Yerlər:</span> {flight.availableSeats} / {flight.totalSeats}
                            </p>
                            <Link
                                to={`/flights/${flight._id}`}
                                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
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

export default FlightListPage;
