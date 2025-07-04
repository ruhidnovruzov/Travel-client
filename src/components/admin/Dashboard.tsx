import React, { useState, useEffect } from 'react';
import { Users, MapPin, Building, Plane, Car, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { apiService } from '../../services/api';
import { User, Tour, Hotel, Flight, Car as CarType } from '../../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTours: 0,
    hotels: 0,
    flights: 0,
    cars: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usersRes, toursRes, hotelsRes, flightsRes, carsRes] = await Promise.all([
          apiService.getUsers(),
          apiService.getTours(),
          apiService.getHotels(),
          apiService.getFlights(),
          apiService.getCars(),
        ]);

        // Calculate revenue from tours and hotels
        const tourRevenue = toursRes.data.reduce((sum: number, tour: Tour) => sum + tour.price, 0);
        const hotelRevenue = hotelsRes.data.reduce((sum: number, hotel: Hotel) => sum + hotel.cheapestPrice, 0);
        const totalRevenue = tourRevenue + hotelRevenue;

        setStats({
          totalUsers: usersRes.count || usersRes.data.length,
          activeTours: toursRes.count || toursRes.data.length,
          hotels: hotelsRes.count || hotelsRes.data.length,
          flights: flightsRes.count || flightsRes.data.length,
          cars: carsRes.count || carsRes.data.length,
          revenue: totalRevenue,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'bg-blue-500', change: '+12.5%' },
    { label: 'Active Tours', value: stats.activeTours.toString(), icon: MapPin, color: 'bg-green-500', change: '+8.2%' },
    { label: 'Hotels', value: stats.hotels.toString(), icon: Building, color: 'bg-purple-500', change: '+3.1%' },
    { label: 'Flights', value: stats.flights.toString(), icon: Plane, color: 'bg-orange-500', change: '+15.3%' },
    { label: 'Cars', value: stats.cars.toString(), icon: Car, color: 'bg-teal-500', change: '+5.7%' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-red-500', change: '+22.4%' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-slate-500 ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">Chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-900">API Status</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Database</span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-900">Last Backup</span>
              <span className="text-xs text-purple-600">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-blue-900">Add New User</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
            <MapPin className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm font-medium text-green-900">Create Tour</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
            <Building className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-purple-900">Add Hotel</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
            <Calendar className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-sm font-medium text-orange-900">Schedule Flight</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;