export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Tour {
  _id: string;
  title: string;
  city: string;
  country: string;
  description: string;
  price: number;
  duration: string;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
  images: string[];
  availableDates: string[];
  createdAt: string;
}

export interface Hotel {
  _id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  stars: number;
  description: string;
  amenities: string[];
  images: string[];
  cheapestPrice: number;
  createdAt: string;
}

export interface Room {
  _id: string;
  hotel: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: Array<{
    number: number;
    unavailableDates: string[];
  }>;
  createdAt: string;
}

export interface Flight {
  _id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  stops: number;
  status: 'scheduled' | 'delayed' | 'cancelled';
  createdAt: string;
}

export interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  dailyRate: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  description: string;
  images: string[];
  location: string;
  isAvailable: boolean;
  unavailableDates: string[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}