import React, { useState, useEffect } from 'react';
import { Flight } from '../../../types';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { apiService } from '../../../services/api';

const FlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    airline: '',
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
    availableSeats: '',
    stops: '',
    status: 'scheduled',
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFlights();
      setFlights(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'flightNumber', label: 'Flight' },
    { key: 'airline', label: 'Airline' },
    { key: 'origin', label: 'From' },
    { key: 'destination', label: 'To' },
    {
      key: 'departureTime',
      label: 'Departure',
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => `$${value}`,
    },
    {
      key: 'availableSeats',
      label: 'Available Seats',
      render: (value: number, row: Flight) => `${value}/${row.totalSeats}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'scheduled' ? 'bg-green-100 text-green-800' :
          value === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedFlight(undefined);
    setFormData({
      airline: '',
      flightNumber: '',
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      totalSeats: '',
      availableSeats: '',
      stops: '',
      status: 'scheduled',
    });
    setShowModal(true);
  };

  const handleEdit = (flight: Flight) => {
    setSelectedFlight(flight);
    setFormData({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime ? new Date(flight.departureTime).toISOString().slice(0, 16) : '',
      arrivalTime: flight.arrivalTime ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : '',
      price: flight.price?.toString() || '',
      totalSeats: flight.totalSeats?.toString() || '',
      availableSeats: flight.availableSeats?.toString() || '',
      stops: flight.stops?.toString() || '',
      status: flight.status || 'scheduled',
    });
    setShowModal(true);
  };

  const handleDelete = async (flight: Flight) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await apiService.deleteFlight(flight._id);
        await fetchFlights();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete flight');
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        airline: formData.airline,
        flightNumber: formData.flightNumber,
        origin: formData.origin,
        destination: formData.destination,
        departureTime: formData.departureTime ? new Date(formData.departureTime).toISOString() : '',
        arrivalTime: formData.arrivalTime ? new Date(formData.arrivalTime).toISOString() : '',
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        availableSeats: formData.availableSeats ? Number(formData.availableSeats) : Number(formData.totalSeats),
        stops: formData.stops ? Number(formData.stops) : 0,
        status: formData.status,
      };
      if (selectedFlight) {
        await apiService.updateFlight(selectedFlight._id, data);
      } else {
        await apiService.createFlight(data);
      }
      await fetchFlights();
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save flight');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchFlights}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable
        data={flights}
        columns={columns}
        title="Flight Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKey="flightNumber"
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedFlight ? 'Edit Flight' : 'Add New Flight'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Airline</label>
              <input
                type="text"
                name="airline"
                value={formData.airline}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Flight Number</label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From (Origin)</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To (Destination)</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departure Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Arrival Time</label>
              <input
                type="datetime-local"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                required
                min={0}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleFormChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Available Seats</label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleFormChange}
                min={0}
                max={formData.totalSeats ? Number(formData.totalSeats) : undefined}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Default: all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stops</label>
              <input
                type="number"
                name="stops"
                value={formData.stops}
                onChange={handleFormChange}
                min={0}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
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
              {selectedFlight ? 'Update' : 'Create'} Flight
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FlightsPage;