// frontend/src/services/bookingService.js

import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

const bookingService = {
    // Yeni rezervasiya yaratmaq funksiyası
    createBooking: async (bookingData) => {
        try {
            const response = await API.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // İstifadəçinin öz rezervasiyalarını almaq funksiyası
    getMyBookings: async () => {
        try {
            const response = await API.get('/bookings/my');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Rezervasiyanı ID-yə görə almaq funksiyası
    getBookingById: async (id) => {
        try {
            const response = await API.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Rezervasiyanın statusunu yeniləmək funksiyası (yalnız admin)
    updateBookingStatus: async (id, statusData) => {
        try {
            const response = await API.put(`/bookings/${id}`, statusData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Rezervasiyanı ləğv etmək funksiyası
    cancelBooking: async (id) => {
        try {
            const response = await API.put(`/bookings/cancel/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Bütün rezervasiyaları almaq funksiyası (yalnız admin)
    getAllBookings: async () => {
        try {
            const response = await API.get('/bookings');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
};

export default bookingService;
