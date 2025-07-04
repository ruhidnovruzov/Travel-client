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
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    stars: '',
    description: '',
    amenities: '',
    images: '',
    cheapestPrice: '',
  });

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
    setFormData({
      name: '',
      address: '',
      city: '',
      country: '',
      stars: '',
      description: '',
      amenities: '',
      images: '',
      cheapestPrice: '',
    });
    setShowModal(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address || '',
      city: hotel.city,
      country: hotel.country,
      stars: hotel.stars?.toString() || '',
      description: hotel.description || '',
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(',') : '',
      images: Array.isArray(hotel.images) ? hotel.images.join(',') : '',
      cheapestPrice: hotel.cheapestPrice?.toString() || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (hotel: Hotel) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await apiService.deleteHotel(hotel._id);
        await fetchHotels();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete hotel');
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        stars: Number(formData.stars),
        cheapestPrice: Number(formData.cheapestPrice),
        amenities: formData.amenities
          ? formData.amenities.split(',').map((a) => a.trim())
          : [],
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim())
          : [],
      };
      if (selectedHotel) {
        await apiService.updateHotel(selectedHotel._id, data);
      } else {
        await apiService.createHotel(data);
      }
      await fetchHotels();
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000055] bg-opacity-30 backdrop-blur-sm">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {selectedHotel ? 'Edit Hotel' : 'Add New Hotel'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stars</label>
                <input
                  type="number"
                  name="stars"
                  value={formData.stars}
                  onChange={handleFormChange}
                  required
                  min={1}
                  max={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amenities (virgüllə ayırın)
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleFormChange}
                  placeholder="wifi, pool, spa"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Images (virgüllə ayırın, URL və ya yol)
                </label>
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleFormChange}
                  placeholder="image1.jpg, image2.jpg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">From Price</label>
                <input
                  type="number"
                  name="cheapestPrice"
                  value={formData.cheapestPrice}
                  onChange={handleFormChange}
                  required
                  min={0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                  {selectedHotel ? 'Update' : 'Create'} Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;