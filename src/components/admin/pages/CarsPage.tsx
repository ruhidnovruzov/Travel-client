import React, { useState, useEffect } from 'react';
import { Car } from '../../../types';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { apiService } from '../../../services/api';

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    dailyRate: '',
    fuelType: '',
    transmission: '',
    seats: '',
    description: '',
    images: '',
    location: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCars();
      setCars(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'brand',
      label: 'Vehicle',
      render: (value: string, row: Car) => `${value} ${row.model}`,
    },
    { key: 'year', label: 'Year' },
    { key: 'licensePlate', label: 'License Plate' },
    {
      key: 'dailyRate',
      label: 'Daily Rate',
      render: (value: number) => `$${value}`,
    },
    { key: 'seats', label: 'Seats' },
    {
      key: 'fuelType',
      label: 'Fuel Type',
      render: (value: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'transmission',
      label: 'Transmission',
      render: (value: string) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded capitalize">
          {value}
        </span>
      ),
    },
    { key: 'location', label: 'Location' },
    {
      key: 'isAvailable',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedCar(undefined);
    setFormData({
      brand: '',
      model: '',
      year: '',
      licensePlate: '',
      dailyRate: '',
      fuelType: '',
      transmission: '',
      seats: '',
      description: '',
      images: '',
      location: '',
      isAvailable: true,
    });
    setShowModal(true);
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year?.toString() || '',
      licensePlate: car.licensePlate,
      dailyRate: car.dailyRate?.toString() || '',
      fuelType: car.fuelType,
      transmission: car.transmission,
      seats: car.seats?.toString() || '',
      description: car.description || '',
      images: Array.isArray(car.images) ? car.images.join(',') : '',
      location: car.location,
      isAvailable: car.isAvailable !== undefined ? car.isAvailable : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (car: Car) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await apiService.deleteCar(car._id);
        await fetchCars();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete car');
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.licensePlate,
        dailyRate: Number(formData.dailyRate),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        seats: Number(formData.seats),
        description: formData.description,
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim())
          : [],
        location: formData.location,
        isAvailable: formData.isAvailable,
      };
      if (selectedCar) {
        await apiService.updateCar(selectedCar._id, data);
      } else {
        await apiService.createCar(data);
      }
      await fetchCars();
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save car');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchCars}
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
        data={cars}
        columns={columns}
        title="Car Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKey="brand"
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCar ? 'Edit Car' : 'Add New Car'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                required
                min={1900}
                max={2100}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License Plate</label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Daily Rate</label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleFormChange}
                required
                min={0}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleFormChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
                <option value="lpg">LPG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              required
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
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
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
              placeholder="car1.jpg, car2.jpg"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleFormChange}
              id="isAvailable"
              className="h-4 w-4 border-slate-300 rounded"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium">
              Available for rent
            </label>
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
              {selectedCar ? 'Update' : 'Create'} Car
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CarsPage;