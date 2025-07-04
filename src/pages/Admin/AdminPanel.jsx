import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Building, 
  Bed, 
  Plane, 
  Car,
  LogOut
} from 'lucide-react';
import Header from '../../components/admin/Header';
import Dashboard from '../../components/admin/Dashboard';
import UsersPage from '../../components/admin/pages/UsersPage';
import ToursPage from '../../components/admin/pages/ToursPage';
import HotelsPage from '../../components/admin/pages/HotelsPage';
import RoomsPage from '../../components/admin/pages/RoomsPage';
import FlightsPage from '../../components/admin/pages/FlightsPage';
import CarsPage from '../../components/admin/pages/CarsPage';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'tours', label: 'Tours', icon: MapPin },
  { id: 'hotels', label: 'Hotels', icon: Building },
  { id: 'rooms', label: 'Rooms', icon: Bed },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'cars', label: 'Cars', icon: Car },
];

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'users': return 'User Management';
      case 'tours': return 'Tour Management';
      case 'hotels': return 'Hotel Management';
      case 'rooms': return 'Room Management';
      case 'flights': return 'Flight Management';
      case 'cars': return 'Car Management';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <UsersPage />;
      case 'tours': return <ToursPage />;
      case 'hotels': return <HotelsPage />;
      case 'rooms': return <RoomsPage />;
      case 'flights': return <FlightsPage />;
      case 'cars': return <CarsPage />;
      default: return <Dashboard />;
    }
  };

  // Logout funksiyası
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  };

 return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header
        title={getPageTitle()}
      />
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 px-2 py-3 bg-white shadow-sm border-b sm:px-6 sm:py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                flex items-center gap-1 px-2 py-2 rounded-md transition-colors text-xs sm:text-base
                ${activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow'
                  : 'text-indigo-700 hover:bg-indigo-100'
                }
              `}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="ml-auto flex items-center gap-1 px-2 py-2 rounded-md text-indigo-500 hover:bg-red-50 hover:text-red-600 transition-colors text-xs sm:text-base"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          Logout
        </button>
      </div>
      <main className="flex-1 overflow-y-auto p-2 sm:p-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPanel;