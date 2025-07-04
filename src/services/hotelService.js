// frontend/src/services/hotelService.js

import axios from 'axios';

// Axios instansiyasını yarat və çərəzlərin göndərilməsini təmin et
const API = axios.create({
    baseURL: 'https://travel-back-5euo.onrender.com/api', // Backend API-nizin əsas URL-i
    withCredentials: true, // Çərəzləri avtomatik göndər və qəbul et
});

const hotelService = {
    // Hotelləri axtarış funksiyası
    getHotels: async (searchParams) => {
        try {
            const response = await API.get('/hotels', { params: searchParams });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Hoteli ID-yə görə almaq funksiyası
    getHotelById: async (id) => {
        try {
            const response = await API.get(`/hotels/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Bir hotelin otaqlarını almaq funksiyası
    getHotelRooms: async (hotelId) => {
        try {
            const response = await API.get(`/rooms/byhotel/${hotelId}`); // Backenddəki /api/rooms/byhotel/:hotelId endpointini istifadə edirik
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Yeni hotel yaratmaq funksiyası
    createHotel: async (hotelData) => {
        try {
            const response = await API.post('/hotels', hotelData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Hoteli yeniləmək funksiyası
    updateHotel: async (id, hotelData) => {
        try {
            const response = await API.put(`/hotels/${id}`, hotelData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Hoteli silmək funksiyası
    deleteHotel: async (id) => {
        try {
            const response = await API.delete(`/hotels/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
};

export default hotelService;
