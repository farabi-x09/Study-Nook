'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, FileText, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function BookNowButton({ room }) {
  const router = useRouter();
  const {
    data: session
  } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [specialNote, setSpecialNote] = useState('');

  // Get today's local date as YYYY-MM-DD for the min attribute of date picker
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    // Run on client to avoid hydration mismatch
    const localToday = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayStr(localToday);
  }, []);

  // Time Slot Definitions
  const startSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Helper to generate end times after selection of start time
  const getEndSlots = (start) => {
    if (!start) return [];
    const startHour = parseInt(start.split(':')[0], 10);
    const slots = [];
    for (let h = startHour + 1; h <= 21; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const endSlots = getEndSlots(startTime);



  // Compute Total Cost
  const startHour = startTime ? parseInt(startTime.split(':')[0], 10) : 0;
  const endHour = endTime ? parseInt(endTime.split(':')[0], 10) : 0;
  const totalHours = endHour > startHour ? endHour - startHour : 0;
  const totalCost = totalHours * (room.hourlyRate || 0);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to book a room.');
      router.push('/signin');
      return;
    }
    if (!date) {
      toast.error('Please select a booking date.');
      return;
    }
    if (!startTime) {
      toast.error('Please select a start time.');
      return;
    }
    if (!endTime) {
      toast.error('Please select an end time.');
      return;
    }

    setLoading(true);

    try {
      const tokenRes = await fetch('/api/auth/token', { credentials: 'include' });
      const { token } = await tokenRes.json();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: room._id || room.id,
          roomName: room.name,
          roomImage: room.imageUrl,
          floor: room.floor,
          date,
          startTime,
          endTime,
          totalCost,
          specialNote,
          userEmail: user?.email,
          userId: user?.id,
          status: 'confirmed',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete booking');
      }

      toast.success('Room booked successfully!');
      setOpen(false);

      // Reset Form State
      setDate('');
      setStartTime('');
      setEndTime('');
      setSpecialNote('');

      // Optionally refresh the page router or redirect to my-bookings page
      router.push('/my-bookings');
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
    // console.log(date, startTime, endTime, totalCost, specialNote);
  };

  return (
    <>
      {/* Book Now Button trigger */}
      <button
        onClick={() => {
          if (!user) {
            toast.error('Please log in to book a study room.');
            const currentPath = window.location.pathname;
            router.push(`/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
            return;
          }
          setOpen(true);
        }}
        className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Calendar size={16} />
        Book Now
      </button>

      {/* Booking Form Modal */}
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
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden font-sans"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <h2 className="text-lg font-bold theme-text">Book Study Room</h2>
                  <p className="text-xs theme-text-muted mt-0.5">Reserve &quot;{room.name}&quot; for your session</p>
                </div>
                <button
                  type="button"
                  onClick={() => !loading && setOpen(false)}
                  className="p-1.5 rounded-lg theme-text-muted hover:bg-amber-500/10 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleBooking} className="p-6 space-y-4">
                {/* Date Picker */}
                <div>
                  <label htmlFor="booking-date" className="block text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide mb-1.5">
                    Session Date
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-3.5 text-amber-600 dark:text-amber-500" />
                    <input
                      id="booking-date"
                      type="date"
                      required
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border theme-input text-sm outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Time Slots row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div>
                    <label htmlFor="start-time" className="block text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide mb-1.5">
                      Start Time
                    </label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-3.5 text-amber-600 dark:text-amber-500" />
                      <select
                        id="start-time"
                        required
                        value={startTime}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          setStartTime(newStart);
                          // Reset end time if it is invalid under the new start time
                          const startHour = parseInt(newStart.split(':')[0], 10);
                          const endHour = endTime ? parseInt(endTime.split(':')[0], 10) : 0;
                          if (endHour <= startHour) {
                            setEndTime('');
                          }
                        }}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border theme-input text-sm outline-none bg-transparent appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="theme-text">Select slot</option>
                        {startSlots.map((time) => (
                          <option key={time} value={time} className="theme-text">
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* End Time */}
                  <div>
                    <label htmlFor="end-time" className="block text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide mb-1.5">
                      End Time
                    </label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-3.5 text-amber-600 dark:text-amber-500" />
                      <select
                        id="end-time"
                        required
                        disabled={!startTime}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border theme-input text-sm outline-none bg-transparent appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="" disabled className="theme-text">Select slot</option>
                        {endSlots.map((time) => (
                          <option key={time} value={time} className="theme-text">
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Note */}
                <div>
                  <label htmlFor="special-note" className="block text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide mb-1.5">
                    Special Note (Optional)
                  </label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-3 text-amber-600 dark:text-amber-500" />
                    <textarea
                      id="special-note"
                      placeholder="Any specific requests, setup needs, etc..."
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      rows={2}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border theme-input text-sm outline-none bg-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Panel */}
                <div
                  className="rounded-xl p-4 border flex items-center justify-between"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <DollarSign size={16} className="text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs theme-text-muted">Total Reservation Cost</p>
                      <p className="text-[10px] theme-text-muted font-medium mt-0.5">
                        {totalHours > 0 ? `${totalHours} hour${totalHours > 1 ? 's' : ''} × $${room.hourlyRate}/hr` : 'Select duration to compute'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-amber-600 dark:text-amber-500">
                      ${totalCost}
                    </span>
                  </div>
                </div>

                {/* Confirm / Cancel Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl border font-semibold text-sm theme-text-muted hover:bg-amber-500/10 transition-all disabled:opacity-50 cursor-pointer"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
