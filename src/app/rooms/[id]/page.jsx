import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Clock, BarChart3, Wifi, Wind, Monitor, Zap, CheckSquare, ArrowLeft, Star } from 'lucide-react';
import EditRoomButton from './EditRoomButton';
import DeleteRoomButton from './DeleteRoomButton';

const AMENITY_ICONS = {
  'Wi-Fi': Wifi,
  'Air Con': Wind,
  'Air Conditioning': Wind,
  'Projector': Monitor,
  'Power Outlets': Zap,
  'Whiteboard': CheckSquare,
  'Quiet Zone': Star,
};

// Dark-mode-safe amenity colors using Tailwind dark: variants
const AMENITY_COLORS = {
  'Wi-Fi':             'bg-blue-50   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300   border-blue-200   dark:border-blue-800',
  'Quiet Zone':        'bg-green-50  dark:bg-green-900/30  text-green-700  dark:text-green-300  border-green-200  dark:border-green-800',
  'Projector':         'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Power Outlets':     'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'Air Con':           'bg-cyan-50   dark:bg-cyan-900/30   text-cyan-700   dark:text-cyan-300   border-cyan-200   dark:border-cyan-800',
  'Air Conditioning':  'bg-cyan-50   dark:bg-cyan-900/30   text-cyan-700   dark:text-cyan-300   border-cyan-200   dark:border-cyan-800',
  'Whiteboard':        'bg-amber-50  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300  border-amber-200  dark:border-amber-800',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200';

export default async function RoomDetailPage({ params }) {
  const { id } = await params;

  let room = null;
  let error = null;

  try {
    const res = await fetch(`http://localhost:5000/room/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    room = await res.json();
  } catch (err) {
    error = err.message;
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4"
           style={{ backgroundColor: 'var(--bg-app)' }}>
        <p className="text-5xl">😕</p>
        <h1 className="text-2xl font-bold theme-text">Room not found</h1>
        <p className="theme-text-muted text-sm">{error || 'This room may have been removed.'}</p>
        <Link
          href="/rooms"
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <ArrowLeft size={16} /> Back to Rooms
        </Link>
      </div>
    );
  }

  const imageUrl = room.imageUrl || FALLBACK_IMAGE;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>

      {/* ── Hero Image ── */}
      <div className="relative w-full h-72 sm:h-96">
        <Image
          src={imageUrl}
          alt={room.name || 'Room'}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        {/* Back button */}
        <Link
          href="/rooms"
          className="absolute top-5 left-5 inline-flex items-center gap-1.5 backdrop-blur-sm text-sm font-semibold px-4 py-2 rounded-xl shadow hover:shadow-md transition-all"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <ArrowLeft size={15} /> Rooms
        </Link>

        {/* Price badge */}
        <div className="absolute top-5 right-5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow">
          ${room.hourlyRate}/hr
        </div>

        {/* Room name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-2">
            <MapPin size={11} /> Floor {room.floor ?? 'N/A'}
          </div>
          <h1
            className="text-white text-3xl font-bold leading-tight drop-shadow"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {room.name || 'Unnamed Room'}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users,    label: 'Capacity', value: `${room.capacity ?? 'N/A'} seats` },
            { icon: Clock,    label: 'Hours',    value: `${room.openHours || '8am'} – ${room.closeHours || '8pm'}` },
            { icon: BarChart3,label: 'Bookings', value: room.bookings ?? 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="theme-card flex flex-col items-center gap-1 rounded-2xl border py-4 px-3 shadow-sm"
            >
              <Icon size={20} className="text-amber-500" />
              <span className="text-xs theme-text-muted font-medium">{label}</span>
              <span className="text-sm font-bold theme-text">{value}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        {room.description && (
          <section>
            <h2
              className="text-xl font-bold theme-text mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              About this room
            </h2>
            <p className="theme-text-muted leading-relaxed text-sm">{room.description}</p>
          </section>
        )}

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <section>
            <h2
              className="text-xl font-bold theme-text mb-3"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((a) => {
                const Icon = AMENITY_ICONS[a];
                return (
                  <span
                    key={a}
                    className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border font-medium ${
                      AMENITY_COLORS[a] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {Icon && <Icon size={13} />}
                    {a}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <div
          className="theme-card rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="theme-text-muted text-sm">Ready to book?</p>
            <p className="theme-text font-bold text-lg">
              ${room.hourlyRate}
              <span className="theme-text-muted font-normal text-sm"> / hour</span>
            </p>
          </div>
          <div className="w-full sm:w-auto flex gap-3">
            <DeleteRoomButton room={room} />
            <EditRoomButton room={room} />
            <button className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Book Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}