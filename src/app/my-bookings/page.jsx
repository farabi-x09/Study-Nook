import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Calendar, Clock, MapPin, Check, X, BookOpen } from 'lucide-react';
import CancelBookingButton from './CancelBookingButton';
import DeleteBookingButton from './DeleteBookingButton';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200';

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

const getHours = (b) => {
  if (!b.startTime || !b.endTime) return 0;
  const s = parseInt(b.startTime.split(':')[0], 10);
  const e = parseInt(b.endTime.split(':')[0], 10);
  return e > s ? e - s : 0;
};

export const metadata = {
  title: "StudyNook – My Bookings",
};

export default async function MyBookingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) redirect('/signin?callbackUrl=%2Fmy-bookings');

  // Get JWT token from the local Better Auth endpoint to authenticate with the external API
  const headersList = await headers();
  const cookieStr = headersList.get('cookie') || '';

  const tokenRes = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/token`, {
    headers: { cookie: cookieStr }
  });

  if (!tokenRes.ok) {
    throw new Error('Failed to authenticate session');
  }

  const { token } = await tokenRes.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking?email=${user.email}`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${token}`,
      cookie: cookieStr,
    }
  });

  if (!res.ok) throw new Error('Failed to fetch bookings');

  const bookings = await res.json();
  
  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  // Sort: confirmed first, then by date desc
  const sorted = [...bookingsArray].sort((a, b) => {
    if (a.status === 'confirmed' && b.status !== 'confirmed') return -1;
    if (a.status !== 'confirmed' && b.status === 'confirmed') return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const totalBooked = sorted.length;
  const upcomingCount = sorted.filter((b) => b.status === 'confirmed').length;
  const totalSpent = sorted.reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);
  const totalStudyTime = sorted.reduce((sum, b) => sum + getHours(b), 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 font-sans">

        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl font-extrabold theme-text tracking-tight mb-1.5"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            My Bookings
          </h1>
          <p className="theme-text-muted text-sm">
            Manage your upcoming and{' '}
            <span className="text-amber-600 dark:text-amber-500 font-medium">past</span>{' '}
            study room reservations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: totalBooked, label: 'Total Booked' },
            { value: upcomingCount, label: 'Upcoming' },
            { value: `$${totalSpent}`, label: 'Total Spent' },
            { value: `${totalStudyTime} hrs`, label: 'Study Time' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="theme-card border rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <span
                className="text-3xl font-black text-amber-600 dark:text-amber-500 leading-none mb-1"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {stat.value}
              </span>
              <span className="text-[10px] font-bold theme-text-muted uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bookings list */}
        <div className="space-y-4">
          {sorted.length === 0 ? (
            <div className="theme-card border rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-5">
                <BookOpen size={30} />
              </div>
              <h3
                className="text-xl font-bold theme-text mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                No reservations yet
              </h3>
              <p className="theme-text-muted text-sm max-w-sm leading-relaxed mb-6">
                Ready to start studying? Browse our premium selection of focus rooms and collaboration bays.
              </p>
              <Link
                href="/rooms"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Browse Study Rooms
              </Link>
            </div>
          ) : (
            sorted.map((booking, index) => {
              const roomImage = booking.roomImage || FALLBACK_IMAGE;
              const roomName = booking.roomName || 'Study Room';
              const floor = booking.floor ?? 'N/A';
              const isConfirmed = booking.status === 'confirmed';

              return (
                <div
                  key={booking._id || index}
                  className="theme-card border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-600/30 transition-all duration-200"
                >
                  {/* Room thumbnail + info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border flex-shrink-0"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <Image
                        src={roomImage}
                        alt={roomName}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/rooms/${booking.roomId}`}
                        className="text-base font-bold theme-text leading-snug truncate hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-150"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {roomName}
                      </Link>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs theme-text-muted mt-1.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-amber-600 dark:text-amber-500" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-amber-600 dark:text-amber-500" />
                          {booking.startTime} – {booking.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-amber-600 dark:text-amber-500" />
                          Floor {floor}
                        </span>
                      </div>

                      {/* Status badge + cancel */}
                      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                        {isConfirmed ? (
                          <>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                              <Check size={10} strokeWidth={3} />
                              Confirmed
                            </span>
                            <CancelBookingButton booking={booking} />
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                              <X size={10} strokeWidth={3} />
                              Cancelled
                            </span>
                            <DeleteBookingButton booking={booking} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="self-start sm:self-center flex-shrink-0">
                    <span
                      className={`text-xl font-black ${
                        isConfirmed
                          ? 'text-amber-600 dark:text-amber-500'
                          : 'text-gray-400 dark:text-stone-600 line-through'
                      }`}
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      ${booking.totalCost || 0}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}