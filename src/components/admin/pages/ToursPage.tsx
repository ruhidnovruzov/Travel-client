import React, { useState, useEffect } from 'react';
import { Tour } from '../../../types';
import DataTable from '../DataTable';
import Modal from '../Modal';
import TourForm from '../forms/TourForm';
import { apiService } from '../../../services/api';

const ToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTours();
      setTours(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    { key: 'duration', label: 'Duration' },
    { key: 'maxGroupSize', label: 'Max Group' },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'easy' ? 'bg-green-100 text-green-800' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedTour(undefined);
    setShowModal(true);
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleDelete = async (tour: Tour) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await apiService.deleteTour(tour._id);
        await fetchTours(); // Refresh the list
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete tour');
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Tour>) => {
    try {
      if (selectedTour) {
        await apiService.updateTour(selectedTour._id, data);
      } else {
        await apiService.createTour(data);
      }
      await fetchTours(); // Refresh the list
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save tour');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={fetchTours}
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
        data={tours}
        columns={columns}
        title="Tour Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKey="title"
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedTour ? 'Edit Tour' : 'Add New Tour'}
        size="lg"
      >
        <TourForm
          tour={selectedTour}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ToursPage;