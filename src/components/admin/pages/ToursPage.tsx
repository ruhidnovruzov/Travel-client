import React, { useState, useEffect } from 'react';
import { Tour } from '../../../types';
import DataTable from '../DataTable';
import { apiService } from '../../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // react-datepicker CSS-ni import et

// Custom Modal komponenti (sadə versiya)
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000055] bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Təsdiq</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200"
          >
            Bəli
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200"
          >
            Xeyr
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Message Display komponenti
interface MessageDisplayProps {
  type: 'success' | 'error';
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ type, message }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';

  return (
    <div className={`p-4 mb-4 rounded-lg text-center font-semibold ${bgColor} ${textColor} border ${borderColor}`}>
      {message}
    </div>
  );
};


const ToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    country: '',
    description: '',
    price: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'easy',
    images: '',
    availableDates: [] as Date[], // Array of Date objects for DatePicker
  });
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


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
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Turlar yüklənərkən xəta baş verdi.' });
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
    setFormData({
      title: '',
      city: '',
      country: '',
      description: '',
      price: '',
      duration: '',
      maxGroupSize: '',
      difficulty: 'easy',
      images: '',
      availableDates: [], // Reset to empty array
    });
    setShowModal(true);
    setActionMessage(null); // Mesajı təmizlə
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setFormData({
      title: tour.title,
      city: tour.city,
      country: tour.country,
      description: tour.description || '',
      price: tour.price?.toString() || '',
      duration: tour.duration?.toString() || '',
      maxGroupSize: tour.maxGroupSize?.toString() || '',
      difficulty: tour.difficulty || 'easy',
      images: Array.isArray(tour.images) ? tour.images.join(',') : '',
      // Convert ISO strings to Date objects for DatePicker
      availableDates: Array.isArray(tour.availableDates)
        ? tour.availableDates.map((d: any) => new Date(d))
        : [],
    });
    setShowModal(true);
    setActionMessage(null); // Mesajı təmizlə
  };

  const handleDeleteClick = (tour: Tour) => {
    setTourToDelete(tour);
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (tourToDelete) {
      setShowConfirmDeleteModal(false);
      try {
        await apiService.deleteTour(tourToDelete._id);
        setActionMessage({ type: 'success', text: 'Tur uğurla silindi.' });
        await fetchTours();
      } catch (err) {
        setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Turu silərkən xəta baş verdi.' });
      } finally {
        setTourToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setTourToDelete(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle DatePicker changes
  const handleDateChange = (dates: Date[]) => {
    setFormData(prev => ({ ...prev, availableDates: dates }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null); // Mesajı təmizlə
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxGroupSize: Number(formData.maxGroupSize),
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim())
          : [],
        // Convert Date objects back to ISO strings for the API
        availableDates: formData.availableDates.map((date) => date.toISOString()),
      };
      if (selectedTour) {
        await apiService.updateTour(selectedTour._id, data);
        setActionMessage({ type: 'success', text: 'Tur uğurla yeniləndi.' });
      } else {
        await apiService.createTour(data);
        setActionMessage({ type: 'success', text: 'Yeni tur uğurla əlavə edildi.' });
      }
      await fetchTours();
      setShowModal(false);
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Turu yadda saxlayarkən xəta baş verdi.' });
    }
  };

  if (error && !actionMessage) { // Yalnız ümumi yükləmə xətası varsa göstər
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
    <div className="space-y-6 p-6">
      {actionMessage && <MessageDisplay type={actionMessage.type} message={actionMessage.text} />}

      <DataTable
        data={tours}
        columns={columns}
        title="Tour Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick} // handleDeleteClick istifadə et
        searchKey="title"
        loading={loading}
      />

      {/* Modal for Add/Edit */}
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
              {selectedTour ? 'Edit Tour' : 'Add New Tour'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* City, Country, Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-1">Duration (gün)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    required
                    min={1}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Price, Max Group Size, Difficulty */}
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
                  <label className="block text-sm font-medium mb-1">Max Group Size</label>
                  <input
                    type="number"
                    name="maxGroupSize"
                    value={formData.maxGroupSize}
                    onChange={handleFormChange}
                    required
                    min={1}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>
              </div>

              {/* Images */}
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Available Dates - DatePicker */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Available Dates (tarixləri seçin)
                </label>
                <DatePicker
                  selected={null}
                  onChange={handleDateChange}
                  selectsMultiple
                  inline
                  highlightDates={formData.availableDates}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  calendarClassName="border border-slate-300 rounded-lg shadow-md"
                />
                {formData.availableDates.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Seçilmiş tarixlər: {formData.availableDates.map(d => d.toLocaleDateString()).join(', ')}
                  </p>
                )}
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
                  {selectedTour ? 'Update' : 'Create'} Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursPage;
