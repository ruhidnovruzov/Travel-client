import React, { useState, useEffect } from 'react';
import { Room } from '../../../types';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { apiService } from '../../../services/api';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRooms();
      setRooms(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => `$${value}`,
    },
    { key: 'maxPeople', label: 'Max People' },
    {
      key: 'roomNumbers',
      label: 'Room Numbers',
      render: (value: Array<{ number: number; unavailableDates: string[] }>) => (
        <div className="flex flex-wrap gap-1">
          {value.map((room, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
              {room.number}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'desc',
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedRoom(undefined);
    setShowModal(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleDelete = async (room: Room) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await apiService.deleteRoom(room._id);
        await fetchRooms(); // Refresh the list
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete room');
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Room>) => {
    try {
      if (selectedRoom) {
        await apiService.updateRoom(selectedRoom._id, data);
      } else {
        // For creating rooms, we need a hotel ID
        // This should be handled in the form component
        console.log('Room creation needs hotel ID');
      }
      await fetchRooms(); // Refresh the list
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save room');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={fetchRooms}
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
        data={rooms}
        columns={columns}
        title="Room Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKey="title"
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRoom ? 'Edit Room' : 'Add New Room'}
        size="lg"
      >
        <div className="p-4 text-center text-slate-500">
          Room form component will be implemented here
        </div>
      </Modal>
    </div>
  );
};

export default RoomsPage;