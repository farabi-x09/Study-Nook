'use client';

import { useState } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DeleteRoomButton({ room }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/room/${room._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete room');
      toast.success('Room deleted successfully');
      router.push('/rooms');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Delete trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 font-semibold text-sm transition-all"
      >
        <Trash2 size={15} />
        Delete
      </button>

      {/* Confirmation modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => !loading && setOpen(false)}
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
              {/* Header */}
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
                  onClick={() => !loading && setOpen(false)}
                  className="p-1.5 rounded-lg theme-text-muted hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                <p className="theme-text-muted text-sm leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold theme-text">&quot;{room.name || 'this room'}&quot;</span>?
                  All data associated with this room will be permanently removed.
                </p>

                {/* Room quick info */}
                <div
                  className="mt-4 flex items-center gap-3 rounded-xl p-3 border"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={14} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold theme-text truncate">{room.name || 'Unnamed Room'}</p>
                    <p className="text-xs theme-text-muted">Floor {room.floor ?? 'N/A'} · ${room.hourlyRate}/hr</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl border font-semibold text-sm theme-text-muted hover:bg-amber-500/10 transition-all disabled:opacity-50"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
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
    </>
  );
}
