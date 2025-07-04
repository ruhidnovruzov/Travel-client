// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import FlightSearchPage from './pages/Flights/FlightSearchPage.jsx'; // Yeni: Uçuş Axtarış Səhifəsi
import FlightListPage from './pages/Flights/FlightListPage.jsx';     // Yeni: Uçuş Nəticələri Səhifəsi
import FlightDetailPage from './pages/Flights/FlightDetailPage.jsx'; // Yeni: Uçuş Detalları Səhifəsi
import MyBookingsPage from './pages/Bookings/MyBookingsPage.jsx';
import HotelSearchPage from './pages/Hotels/HotelSearchPage.jsx'; // Yeni: Hotel Axtarış Səhifəsi
import HotelListPage from './pages/Hotels/HotelListPage.jsx';     // Yeni: Hotel Nəticələri Səhifəsi
import HotelDetailPage from './pages/Hotels/HotelDetailPage.jsx'; // Yeni: Hotel Detalları Səhifəsi
import TourListPage from './pages/Tours/TourListPage.jsx';     // Yeni: Tur Siyahısı Səhifəsi
import TourDetailPage from './pages/Tours/TourDetailPage.jsx'; // Yeni: Tur Detalları Səhifəsi
import CarDetailPage from './pages/Cars/CarDetailPage.jsx';
import CarListPage from './pages/Cars/CarListPage.jsx';
import AboutPage from './pages/About/AboutPage.jsx';
import ContactPage from './pages/Contact/ContactPage.jsx';
import Footer from './components/common/Footer.jsx';
import AdminPanel from './pages/Admin/AdminPanel.jsx';
import { AuthProvider } from './context/AuthContext.jsx';



function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Paneli */}
          <Route path="/admin" element={<AdminPanel />} />
          

          {/* Uçuş Marşrutları */}
          <Route path="/flights" element={<FlightSearchPage />} />
          <Route path="/flights/results" element={<FlightListPage />} />
          <Route path="/flights/:id" element={<FlightDetailPage />} />

          {/* Hotel Marşrutları */}
          <Route path="/hotels" element={<HotelSearchPage />} />
          <Route path="/hotels/results" element={<HotelListPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />

          {/* Tur Marşrutları */}
          <Route path="/tours" element={<TourListPage />} />
          <Route path="/tours/:id" element={<TourDetailPage />} />

          {/* Avtomobil Marşrutları */}
          <Route path="/cars" element={<CarListPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />

          {/* Haqqında Səhifə */}
          <Route path="/about" element={<AboutPage />} />

          {/* Əlaqə Səhifəsi */}
          <Route path="/contact" element={<ContactPage />} />


          {/* Rezervasiyalar */}
          <Route path="/bookings" element={<MyBookingsPage />} />

          {/* Digər səhifələr bura əlavə olunacaq */}
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
