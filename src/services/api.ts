import { User, Tour, Hotel, Room, Flight, Car, Booking, ApiResponse } from '../types';

const API_BASE_URL = 'https://travel-back-new.onrender.com/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Users
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`);
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  async updateUserRole(id: string, role: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async createUser(user: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Tours
  async getTours(): Promise<ApiResponse<Tour[]>> {
    return this.request('/tours');
  }

  async getTourById(id: string): Promise<ApiResponse<Tour>> {
    return this.request(`/tours/${id}`);
  }

  async createTour(tour: Partial<Tour>): Promise<ApiResponse<Tour>> {
    return this.request('/tours', {
      method: 'POST',
      body: JSON.stringify(tour),
    });
  }

  async updateTour(id: string, tour: Partial<Tour>): Promise<ApiResponse<Tour>> {
    return this.request(`/tours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tour),
    });
  }

  async deleteTour(id: string): Promise<ApiResponse<null>> {
    return this.request(`/tours/${id}`, { method: 'DELETE' });
  }

  // Hotels
  async getHotels(): Promise<ApiResponse<Hotel[]>> {
    return this.request('/hotels');
  }

  async getHotelById(id: string): Promise<ApiResponse<Hotel>> {
    return this.request(`/hotels/${id}`);
  }

  async createHotel(hotel: Partial<Hotel>): Promise<ApiResponse<Hotel>> {
    return this.request('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotel),
    });
  }

  async updateHotel(id: string, hotel: Partial<Hotel>): Promise<ApiResponse<Hotel>> {
    return this.request(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotel),
    });
  }

  async deleteHotel(id: string): Promise<ApiResponse<null>> {
    return this.request(`/hotels/${id}`, { method: 'DELETE' });
  }

  // Rooms
  async getRooms(): Promise<ApiResponse<Room[]>> {
    return this.request('/rooms');
  }

  async getRoomById(id: string): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/${id}`);
  }

  async createRoom(hotelId: string, room: Partial<Room>): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/hotel/${hotelId}`, {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  async updateRoom(id: string, room: Partial<Room>): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(room),
    });
  }

  async deleteRoom(id: string): Promise<ApiResponse<null>> {
    return this.request(`/rooms/${id}`, { method: 'DELETE' });
  }

  async getHotelRooms(hotelId: string): Promise<ApiResponse<Room[]>> {
    return this.request(`/rooms/byhotel/${hotelId}`);
  }

  async updateRoomAvailability(id: string, dates: string[], roomNumber: number): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/availability/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ dates, roomNumber }),
    });
  }

  // Flights
  async getFlights(): Promise<ApiResponse<Flight[]>> {
    return this.request('/flights');
  }

  async getFlightById(id: string): Promise<ApiResponse<Flight>> {
    return this.request(`/flights/${id}`);
  }

  async createFlight(flight: Partial<Flight>): Promise<ApiResponse<Flight>> {
    return this.request('/flights', {
      method: 'POST',
      body: JSON.stringify(flight),
    });
  }

  async updateFlight(id: string, flight: Partial<Flight>): Promise<ApiResponse<Flight>> {
    return this.request(`/flights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(flight),
    });
  }

  async deleteFlight(id: string): Promise<ApiResponse<null>> {
    return this.request(`/flights/${id}`, { method: 'DELETE' });
  }

  // Cars
  async getCars(): Promise<ApiResponse<Car[]>> {
    return this.request('/cars');
  }

  async getCarById(id: string): Promise<ApiResponse<Car>> {
    return this.request(`/cars/${id}`);
  }

  async createCar(car: Partial<Car>): Promise<ApiResponse<Car>> {
    return this.request('/cars', {
      method: 'POST',
      body: JSON.stringify(car),
    });
  }

  async updateCar(id: string, car: Partial<Car>): Promise<ApiResponse<Car>> {
    return this.request(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(car),
    });
  }

  async deleteCar(id: string): Promise<ApiResponse<null>> {
    return this.request(`/cars/${id}`, { method: 'DELETE' });
  }

  async updateCarAvailability(id: string, dates: string[]): Promise<ApiResponse<Car>> {
    return this.request(`/cars/availability/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ dates }),
    });
  }

  // Bookings (New methods for bookings)
  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request('/bookings'); // Admin üçün bütün rezervasiyaları gətirir
  }

  async updateBookingStatus(id: string, statusData: { status?: string; paymentStatus?: string }): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // You might also need a getBookingById for admin if you want to view a single booking's details
  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${id}`);
  }

  // If you want to allow admin to create bookings directly (less common for admin panels)
  async createBooking(bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }
}

export const apiService = new ApiService();
