'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function DeleteBookingButton({ booking }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
      });
    }
    return dateStr;
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${booking._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete booking');
      toast.success('Booking deleted.');
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Delete booking"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
      >
        <Trash2 size={10} strokeWidth={3} />
        Delete
      </button>

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
              initial={{ scale: 0.93, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full max-w-sm theme-card border rounded-3xl shadow-2xl p-7 flex flex-col items-center text-center font-sans"
              style={{ border: '1px solid var(--border-color)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                <Trash2 size={22} />
              </div>
              <h3
                className="text-lg font-bold theme-text mb-1"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Delete Booking?
              </h3>
              <p className="theme-text-muted text-xs leading-relaxed max-w-xs mb-6">
                Permanently remove the cancelled booking for{' '}
                <strong className="theme-text">{booking.roomName || 'this room'}</strong>{' '}
                on{' '}
                <strong className="theme-text">{formatDate(booking.date)}</strong>?
                This cannot be undone.
              </p>

              <div className="flex w-full gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold text-xs theme-text-muted hover:bg-amber-500/10 transition-all disabled:opacity-50 cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  No, Keep
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
