// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import FlightSearchPage from './pages/Flights/FlightSearchPage.jsx';
import FlightListPage from './pages/Flights/FlightListPage.jsx';
import FlightDetailPage from './pages/Flights/FlightDetailPage.jsx';
import MyBookingsPage from './pages/Bookings/MyBookingsPage.jsx';
import HotelSearchPage from './pages/Hotels/HotelSearchPage.jsx';
import HotelListPage from './pages/Hotels/HotelListPage.jsx';
import HotelDetailPage from './pages/Hotels/HotelDetailPage.jsx';
import TourListPage from './pages/Tours/TourListPage.jsx';
import TourDetailPage from './pages/Tours/TourDetailPage.jsx';
import CarDetailPage from './pages/Cars/CarDetailPage.jsx';
import CarListPage from './pages/Cars/CarListPage.jsx';
import AboutPage from './pages/About/AboutPage.jsx';
import ContactPage from './pages/Contact/ContactPage.jsx';
import Footer from './components/common/Footer.jsx';
import AdminPanel from './pages/Admin/AdminPanel.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage.jsx';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage.jsx';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Link } from 'react-router-dom';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)] bg-gray-50">
          <Routes>
            {/* Açıq səhifələr - hər kəs daxil ola bilər */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Uçuş axtarış səhifələri - açıq */}
            <Route path="/flights" element={<FlightSearchPage />} />
            <Route path="/flights/results" element={<FlightListPage />} />
            <Route path="/flights/:id" element={<FlightDetailPage />} />

            {/* Hotel axtarış səhifələri - açıq */}
            <Route path="/hotels" element={<HotelSearchPage />} />
            <Route path="/hotels/results" element={<HotelListPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />

            {/* Tur səhifələri - açıq */}
            <Route path="/tours" element={<TourListPage />} />
            <Route path="/tours/:id" element={<TourDetailPage />} />

            {/* Avtomobil səhifələri - açıq */}
            <Route path="/cars" element={<CarListPage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />

            {/* Giriş tələb olunan səhifələr */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              } 
            />

            {/* Admin paneli - yalnız admin rollu istifadəçilər */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />

            {/* 404 səhifə tapılmadı */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

// 404 səhifəsi
const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] pt-20 flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Səhifə Tapılmadı
          </h2>
          <p className="text-gray-600 mb-6">
            Axtardığınız səhifə mövcud deyil və ya silinib.
          </p>
        </div>

        <Link
          to="/"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 inline-block"
        >
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    </div>
  );
};

export default App;