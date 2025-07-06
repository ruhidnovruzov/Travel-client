import React, { useState, useEffect } from 'react';
import { Booking } from '../../../types';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { apiService } from '../../../services/api';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFormData, setStatusFormData] = useState({
    status: '',
    paymentStatus: '',
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllBookings();
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeColor = (bookingType: string) => {
    switch (bookingType) {
      case 'flight':
        return 'bg-blue-100 text-blue-800';
      case 'hotel':
        return 'bg-purple-100 text-purple-800';
      case 'tour':
        return 'bg-orange-100 text-orange-800';
      case 'car':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Customer',
      render: (value: any) => (
        <div>
          <div className="font-medium">{value?.name || 'Mövcud deyil'}</div>
          <div className="text-sm text-gray-500">{value?.email || 'Mövcud deyil'}</div>
        </div>
      ),
    },
    {
      key: 'bookingType',
      label: 'Type',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded capitalize ${getBookingTypeColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'bookedItem',
      label: 'Item',
      render: (value: any, row: Booking) => {
        if (!value) return 'Mövcud deyil';
        
        switch (row.bookingType) {
          case 'flight':
            return `${value.airline} ${value.flightNumber}`;
          case 'hotel':
            return `${value.name} - Room ${row.roomNumber}`;
          case 'tour':
            return value.title;
          case 'car':
            return `${value.brand} ${value.model}`;
          default:
            return value.name || value.title || 'Mövcud deyil';
        }
      },
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Mövcud deyil',
    },
    {
      key: 'totalPrice',
      label: 'Total Price',
      render: (value: number) => `$${value}`,
    },
    {
      key: 'passengers',
      label: 'Passengers',
      render: (value: number) => value || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleStatusUpdate = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusFormData({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
    setShowModal(true);
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await apiService.cancelBooking(booking._id);
        await fetchBookings();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to cancel booking');
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStatusFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      await apiService.updateBookingStatus(selectedBooking._id, statusFormData);
      await fetchBookings();
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = !searchTerm || 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingType.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const bookingActions = [
    {
      label: 'Update Status',
      onClick: handleStatusUpdate,
      className: 'text-blue-600 hover:text-blue-800',
    },
    {
      label: 'Cancel',
      onClick: handleCancelBooking,
      className: 'text-red-600 hover:text-red-800',
      condition: (booking: Booking) => booking.status !== 'cancelled',
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchBookings}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      color: 'bg-blue-500',
    },
    {
      title: 'Confirmed',
      value: bookings.filter(b => b.status === 'confirmed').length,
      color: 'bg-green-500',
    },
    {
      title: 'Pending',
      value: bookings.filter(b => b.status === 'pending').length,
      color: 'bg-yellow-500',
    },
    {
      title: 'Cancelled',
      value: bookings.filter(b => b.status === 'cancelled').length,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 w-12 flex items-center justify-center h-12 rounded-full ${stat.color} text-white mr-4`}>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name, email, or booking type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <DataTable
        data={filteredBookings}
        columns={columns}
        title="Booking Management"
        actions={bookingActions}
        loading={loading}
        searchKey="user.name"
        showAdd={false}
      />

      {/* Status Update Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Update Booking Status"
        size="sm"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Booking Status</label>
            <select
              name="status"
              value={statusFormData.status}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={statusFormData.paymentStatus}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {selectedBooking && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Booking Details:</h4>
              <div className="text-sm space-y-1">
                <p><strong>Customer:</strong> {selectedBooking.user?.name}</p>
                <p><strong>Type:</strong> {selectedBooking.bookingType}</p>
                <p><strong>Total Price:</strong> ${selectedBooking.totalPrice}</p>
                <p><strong>Current Status:</strong> {selectedBooking.status}</p>
                <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingsPage;