// frontend/src/services/flightService.js

import axios from 'axios';

// Axios instansiyasını yarat və çərəzlərin göndərilməsini təmin et
const API = axios.create({
    baseURL: 'https://travel-back-5euo.onrender.com/api', // Backend API-nizin əsas URL-i
    withCredentials: true, // Çərəzləri avtomatik göndər və qəbul et
});

const flightService = {
    // Uçuşları axtarış funksiyası
    getFlights: async (searchParams) => {
        try {
            const response = await API.get('/flights', { params: searchParams });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Uçuşu ID-yə görə almaq funksiyası
    getFlightById: async (id) => {
        try {
            const response = await API.get(`/flights/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Yeni uçuş yaratmaq funksiyası
    createFlight: async (flightData) => {
        try {
            const response = await API.post('/flights', flightData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Uçuşu yeniləmək funksiyası
    updateFlight: async (id, flightData) => {
        try {
            const response = await API.put(`/flights/${id}`, flightData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Uçuşu silmək funksiyası
    deleteFlight: async (id) => {
        try {
            const response = await API.delete(`/flights/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
};

export default flightService;
