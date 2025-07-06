import axios from 'axios';

const API = axios.create({
    baseURL: 'https://travel-back-new.onrender.com/api',
    withCredentials: true,
});

// Axios interceptor – hər sorğudan əvvəl tokeni header-ə əlavə et
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const bookingService = {
    createBooking: async (bookingData) => {
        try {
            const response = await API.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getMyBookings: async () => {
        try {
            const response = await API.get('/bookings/my');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getBookingById: async (id) => {
        try {
            const response = await API.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    updateBookingStatus: async (id, statusData) => {
        try {
            const response = await API.put(`/bookings/${id}/status`, statusData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    cancelBooking: async (id) => {
        try {
            const response = await API.put(`/bookings/${id}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getAllBookings: async () => {
        try {
            const response = await API.get('/bookings');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    confirmBookingPayment: async (id, paymentData) => {
        try {
            const response = await API.put(`/bookings/${id}/confirm-payment`, paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
};

export default bookingService;
