import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import Dashboard from '../../components/admin/Dashboard';
import UsersPage from '../../components/admin/pages/UsersPage';
import ToursPage from '../../components/admin/pages/ToursPage';
import HotelsPage from '../../components/admin/pages/HotelsPage';
import RoomsPage from '../../components/admin/pages/RoomsPage';
import FlightsPage from '../../components/admin/pages/FlightsPage';
import CarsPage from '../../components/admin/pages/CarsPage';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle()}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;