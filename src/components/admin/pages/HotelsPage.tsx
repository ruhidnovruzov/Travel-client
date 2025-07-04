import React, { useState, useEffect } from 'react';
import { Hotel } from '../../../types';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { apiService } from '../../../services/api';

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHotels();
      setHotels(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    {
      key: 'stars',
      label: 'Stars',
      render: (value: number) => (
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-lg ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'cheapestPrice',
      label: 'From Price',
      render: (value: number) => `$${value}`,
    },
    {
      key: 'amenities',
      label: 'Amenities',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((amenity, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {amenity}
            </span>
          ))}
          {value.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{value.length - 3}
            </span>
          )}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedHotel(undefined);
    setShowModal(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const handleDelete = async (hotel: Hotel) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await apiService.deleteHotel(hotel._id);
        await fetchHotels(); // Refresh the list
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete hotel');
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Hotel>) => {
    try {
      if (selectedHotel) {
        await apiService.updateHotel(selectedHotel._id, data);
      } else {
        await apiService.createHotel(data);
      }
      await fetchHotels(); // Refresh the list
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save hotel');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={fetchHotels}
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
        data={hotels}
        columns={columns}
        title="Hotel Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKey="name"
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedHotel ? 'Edit Hotel' : 'Add New Hotel'}
        size="lg"
      >
        <div className="p-4 text-center text-slate-500">
          Hotel form component will be implemented here
        </div>
      </Modal>
    </div>
  );
};

export default HotelsPage;