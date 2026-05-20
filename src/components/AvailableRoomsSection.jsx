import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const FALLBACK =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800';

const AMENITY_STYLE = {
  'Wi-Fi':             'bg-blue-50   text-blue-700  dark:bg-blue-950/30  dark:text-blue-300',
  'Quiet Zone':        'bg-green-50  text-green-700 dark:bg-green-950/30 dark:text-green-300',
  'Projector':         'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300',
  'Power Outlets':     'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
  'Air Con':           'bg-cyan-50   text-cyan-700  dark:bg-cyan-950/30  dark:text-cyan-300',
  'Air Conditioning':  'bg-cyan-50   text-cyan-700  dark:bg-cyan-950/30  dark:text-cyan-300',
  'Whiteboard':        'bg-amber-50  text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
};

function RoomCardStatic({ room }) {
  const id   = room._id || room.id;
  const name = room.name || 'Study Room';
  const img  = room.imageUrl || FALLBACK;
  const desc = room.description || 'A comfortable space to focus and get work done.';
  const truncated = desc.length > 100 ? desc.slice(0, 97) + '…' : desc;
  const amenities  = room.amenities || [];
  const shown      = amenities.slice(0, 3);
  const extra      = amenities.length - shown.length;

  return (
    <div className="theme-card border rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl hover:border-amber-400/50 dark:hover:border-amber-600/30 transition-all duration-200 h-full">

      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <Image
          src={img}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
        {/* Rate badge */}
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#1C1410]/95 text-amber-800 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg border theme-border">
          ${room.hourlyRate || room.rate || '?'}/hr
        </div>
        {/* Floor badge */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <MapPin size={10} />
          Floor {room.floor ?? 'N/A'}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-bold theme-text text-base leading-snug" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
            {name}
          </h3>
          <p className="theme-text-muted text-sm mt-1 leading-relaxed">{truncated}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs theme-text-muted font-medium">
          <span className="flex items-center gap-1">
            <Users size={12} className="text-amber-600 dark:text-amber-500" />
            {room.capacity || 'N/A'} seats
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-amber-600 dark:text-amber-500" />
            {room.openHours || '8am'}–{room.closeHours || '8pm'}
          </span>
        </div>

        {/* Amenity chips */}
        <div className="flex flex-wrap gap-1.5">
          {shown.map((a) => (
            <span
              key={a}
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${AMENITY_STYLE[a] || 'bg-gray-100 text-gray-600 dark:bg-stone-800 dark:text-stone-300'}`}
            >
              {a}
            </span>
          ))}
          {extra > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-400 font-medium">
              +{extra} more
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Link
          href={`/rooms/${id}`}
          className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-sm text-center shadow hover:shadow-lg transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default async function AvailableRoomsSection() {
  let rooms = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room?sort=latest&limit=6`, {
      cache: 'no-store',
    });
    rooms = await res.json();
  } catch {
    rooms = [];
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 mb-3">
            <Sparkles size={11} />
            Latest listings
          </div>
          <h2
            className="text-3xl font-extrabold theme-text"
            style={{ fontFamily: 'var(--font-playfair, serif)' }}
          >
            Available Study Rooms
          </h2>
          <p className="theme-text-muted text-sm mt-1.5">
            Hand-picked focus spaces, updated in real time.
          </p>
        </div>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-500 hover:gap-3 transition-all"
        >
          Browse all rooms <ArrowRight size={15} />
        </Link>
      </div>

      {/* Grid */}
      {rooms.length === 0 ? (
        <div className="theme-card border rounded-2xl p-12 text-center">
          <BookOpen className="mx-auto mb-3 text-amber-500" size={32} />
          <p className="theme-text-muted text-sm">No rooms available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <RoomCardStatic key={room._id || i} room={room} />
          ))}
        </div>
      )}
    </section>
  );
}
