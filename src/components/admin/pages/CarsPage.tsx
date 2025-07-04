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
    setShowModal(true);
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleDelete = async (car: Car) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await apiService.deleteCar(car._id);
        await fetchCars(); // Refresh the list
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete car');
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Car>) => {
    try {
      if (selectedCar) {
        await apiService.updateCar(selectedCar._id, data);
      } else {
        await apiService.createCar(data);
      }
      await fetchCars(); // Refresh the list
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
        <div className="p-4 text-center text-slate-500">
          Car form component will be implemented here
        </div>
      </Modal>
    </div>
  );
};

export default CarsPage;