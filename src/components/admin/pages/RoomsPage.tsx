import React, { useState, useEffect } from 'react';
import { Room, Hotel } from '../../../types';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { apiService } from '../../../services/api';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    hotelId: '',
    title: '',
    price: '',
    maxPeople: '',
    desc: '',
    roomNumbers: '', // comma separated, e.g. "101,102,103"
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
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

  const fetchHotels = async () => {
    try {
      const response = await apiService.getHotels();
      setHotels(response.data);
    } catch {
      setHotels([]);
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
    {
      key: 'hotel',
      label: 'Hotel',
      render: (value: any) => value?.name || '',
    },
  ];

  const handleAdd = () => {
    setSelectedRoom(undefined);
    setFormData({
      hotelId: '',
      title: '',
      price: '',
      maxPeople: '',
      desc: '',
      roomNumbers: '',
    });
    setShowModal(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      hotelId: typeof room.hotel === 'object' && room.hotel ? (room.hotel as any)._id : '',
      title: room.title,
      price: room.price?.toString() || '',
      maxPeople: room.maxPeople?.toString() || '',
      desc: room.desc || '',
      roomNumbers: Array.isArray(room.roomNumbers)
        ? room.roomNumbers.map((r: any) => r.number).join(',')
        : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (room: Room) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await apiService.deleteRoom(room._id);
        await fetchRooms();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete room');
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
        title: formData.title,
        price: Number(formData.price),
        maxPeople: Number(formData.maxPeople),
        desc: formData.desc,
        roomNumbers: formData.roomNumbers
          ? formData.roomNumbers.split(',').map(num => ({
              number: Number(num.trim()),
              unavailableDates: [],
            }))
          : [],
      };

      if (selectedRoom) {
        await apiService.updateRoom(selectedRoom._id, data);
      } else {
        if (!formData.hotelId) {
          alert('Please select a hotel for this room.');
          return;
        }
        await apiService.createRoom(formData.hotelId, data);
      }
      await fetchRooms();
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
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Hotel seçimi yalnız əlavə edəndə */}
          {!selectedRoom && (
            <div>
              <label className="block text-sm font-medium mb-1">Hotel</label>
              <select
                name="hotelId"
                value={formData.hotelId}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select hotel</option>
                {hotels.map(hotel => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name} ({hotel.city})
                  </option>
                ))}
              </select>
            </div>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">Max People</label>
              <input
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleFormChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room Numbers (virgüllə ayırın)</label>
            <input
              type="text"
              name="roomNumbers"
              value={formData.roomNumbers}
              onChange={handleFormChange}
              placeholder="101,102,103"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleFormChange}
              required
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
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
              {selectedRoom ? 'Update' : 'Create'} Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomsPage;