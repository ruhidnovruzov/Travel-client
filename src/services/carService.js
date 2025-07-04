// frontend/src/services/carService.js

import axios from 'axios';

// Axios instansiyasını yarat və çərəzlərin göndərilməsini təmin et
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend API-nizin əsas URL-i
    withCredentials: true, // Çərəzləri avtomatik göndər və qəbul et
});

const carService = {
    // Avtomobilləri axtarış funksiyası
    getCars: async (searchParams) => {
        try {
            const response = await API.get('/cars', { params: searchParams });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Avtomobili ID-yə görə almaq funksiyası
    getCarById: async (id) => {
        try {
            const response = await API.get(`/cars/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Yeni avtomobil yaratmaq funksiyası
    createCar: async (carData) => {
        try {
            const response = await API.post('/cars', carData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Avtomobili yeniləmək funksiyası
    updateCar: async (id, carData) => {
        try {
            const response = await API.put(`/cars/${id}`, carData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Admin: Avtomobili silmək funksiyası
    deleteCar: async (id) => {
        try {
            const response = await API.delete(`/cars/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
};

export default carService;
