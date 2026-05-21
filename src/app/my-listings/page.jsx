"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Users, DollarSign, Trash2, Edit, AlertTriangle, Plus, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, Button, Spinner } from '@heroui/react';
import Link from 'next/link';
import Image from 'next/image';

export default function MyListingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    hourlyRate: '',
    capacity: ''
  });

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyRooms = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room?email=${user.email}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch your listings.');
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : data.rooms || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isPending && !user) {
      router.push('/signin');
    } else if (user) {
      const run = async () => {
        await fetchMyRooms();
      };
      run();
    }
  }, [user, isPending, router, fetchMyRooms]);

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    try {
      const tokenRes = await fetch("/api/auth/token", {
        credentials: "include",
      });
      if (!tokenRes.ok) throw new Error('Failed to authenticate');
      const { token } = await tokenRes.json();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room/${roomToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete room');

      toast.success('Room listing deleted successfully!');
      setRooms(prev => prev.filter(r => r._id !== roomToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (room) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (room) => {
    setRoomToEdit(room);
    setEditFormData({
      name: room.name,
      hourlyRate: room.hourlyRate,
      capacity: room.capacity
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: editFormData.name,
        hourlyRate: parseFloat(editFormData.hourlyRate),
        capacity: parseInt(editFormData.capacity, 10),
      };

      const tokenRes = await fetch('/api/auth/token', { credentials: 'include' });
      const { token } = await tokenRes.json();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room/${roomToEdit._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Failed to update room');
      
      toast.success('Room updated successfully!');
      setIsEditModalOpen(false);
      void fetchMyRooms(); // refresh list
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isPending || (loading && !rooms.length)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold theme-text font-serif">My Listings</h1>
          <p className="theme-text-muted mt-2">Manage the study rooms you have listed.</p>
        </div>
        <Link href="/add-room">
          <Button className="bg-[#E58B19] hover:bg-[#D97706] text-white font-semibold" endContent={<Plus size={16} />}>
            Add New Room
          </Button>
        </Link>
      </div>

      {rooms.length === 0 ? (
        <Card className="theme-card p-12 text-center border-dashed border-2 border-amber-200 dark:border-amber-900 shadow-none">
          <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
            <Building2 className="text-amber-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold theme-text mb-2">No listings found</h3>
          <p className="theme-text-muted mb-6">You haven&apos;t listed any study rooms yet.</p>
          <Link href="/add-room">
            <Button className="bg-[#E58B19] text-white" radius="full">
              Create Your First Listing
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Card className="theme-card h-full overflow-hidden border theme-border hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'; }}
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-sm font-bold text-amber-600 dark:text-amber-400 shadow-lg">
                      ${room.hourlyRate}/hr
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold theme-text mb-2 truncate">{room.name}</h3>
                  <div className="flex items-center gap-4 text-sm theme-text-muted mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-amber-500" />
                      {room.floor}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-amber-500" />
                      Up to {room.capacity}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t theme-border mt-auto">
                    <Button
                      className="flex-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-medium"
                      variant="flat"
                      onClick={() => openEditModal(room)}
                      startContent={<Edit size={16} />}
                    >
                      Update
                    </Button>
                    <Button
                      className="flex-1 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-medium"
                      variant="flat"
                      onClick={() => openDeleteModal(room)}
                      startContent={<Trash2 size={16} />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-[#1C1410] rounded-2xl shadow-2xl overflow-hidden border theme-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b theme-border">
                <h2 className="text-xl font-bold theme-text">Update Listing</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="theme-text-muted hover:text-amber-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold theme-text-muted mb-1.5">Room Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border theme-border bg-transparent theme-text focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold theme-text-muted mb-1.5">Hourly Rate ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={editFormData.hourlyRate}
                      onChange={(e) => setEditFormData({ ...editFormData, hourlyRate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border theme-border bg-transparent theme-text focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold theme-text-muted mb-1.5">Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editFormData.capacity}
                      onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border theme-border bg-transparent theme-text focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="flat"
                    className="flex-1 theme-text-muted bg-gray-100 dark:bg-white/5"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#E58B19] text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && roomToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={22} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold theme-text">Delete Room</h2>
                    <p className="text-xs theme-text-muted mt-0.5">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                  className="p-1.5 rounded-lg theme-text-muted hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 pb-6">
                <p className="theme-text-muted text-sm leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold theme-text">&quot;{roomToDelete.name || 'this room'}&quot;</span>?
                  All data associated with this room will be permanently removed.
                </p>

                <div
                  className="mt-4 flex items-center gap-3 rounded-xl p-3 border"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={14} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold theme-text truncate">{roomToDelete.name || 'Unnamed Room'}</p>
                    <p className="text-xs theme-text-muted">Floor {roomToDelete.floor ?? 'N/A'} · ${roomToDelete.hourlyRate}/hr</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl border font-semibold text-sm theme-text-muted hover:bg-amber-500/10 transition-all disabled:opacity-50"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <Trash2 size={15} />
                        Yes, Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}