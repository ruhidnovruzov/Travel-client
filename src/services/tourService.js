// frontend/src/services/tourService.js

import axios from 'axios';

// Axios instansiyasını yarat və çərəzlərin göndərilməsini təmin et
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend API-nizin əsas URL-i
    withCredentials: true, // Çərəzləri avtomatik göndər və qəbul et
});

const tourService = {
    // Turları axtarış funksiyası
    getTours: async (searchParams) => {
        try {
            const response = await API.get('/tours', { params: searchParams });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Turu ID-yə görə almaq funksiyası
    getTourById: async (id) => {
        try {
            const response = await API.get(`/tours/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Yeni tur yaratmaq funksiyası
    createTour: async (tourData) => {
        try {
            const response = await API.post('/tours', tourData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Turu yeniləmək funksiyası
    updateTour: async (id, tourData) => {
        try {
            const response = await API.put(`/tours/${id}`, tourData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Turu silmək funksiyası
    deleteTour: async (id) => {
        try {
            const response = await API.delete(`/tours/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
};

export default tourService;
