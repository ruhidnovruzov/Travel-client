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
    setShowModal(true);
  };

  const handleEdit = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const handleDelete = async (flight: Flight) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await apiService.deleteFlight(flight._id);
        await fetchFlights(); // Refresh the list
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete flight');
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Flight>) => {
    try {
      if (selectedFlight) {
        await apiService.updateFlight(selectedFlight._id, data);
      } else {
        await apiService.createFlight(data);
      }
      await fetchFlights(); // Refresh the list
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
        <div className="p-4 text-center text-slate-500">
          Flight form component will be implemented here
        </div>
      </Modal>
    </div>
  );
};

export default FlightsPage;