'use client';
import React, { useState } from 'react';
import { MapPin, Users, Clock, BarChart3, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const COLORS = {
  amber: '#F59E0B',
  amberDark: '#D97706',
  amberLight: '#FEF3C7',
  amberXLight: '#FFFBF0',
  brown: '#1C1410',
  brown2: '#44322A',
  muted: '#78716C',
  border: '#FDE68A',
  white: '#FFFFFF',
  cream: '#FFFBF0',
};

const AMENITY_COLORS = {
  'Wi-Fi': 'bg-blue-50 text-blue-700',
  'Quiet Zone': 'bg-green-50 text-green-700',
  'Projector': 'bg-purple-50 text-purple-700',
  'Power Outlets': 'bg-orange-50 text-orange-700',
  'Air Con': 'bg-cyan-50 text-cyan-700',
  'Air Conditioning': 'bg-cyan-50 text-cyan-700',
  'Whiteboard': 'bg-amber-50 text-amber-700',
};

export default function RoomCard({ room, onView, onSave }) {
  const [isSaved, setIsSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    room.imageUrl ||  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600'
  );

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgSrc(room.imageUrl ||  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600');
  }, [room.imageUrl, room.image]);

  return (
    <div 
      className="theme-card rounded-2xl border overflow-hidden flex flex-col group transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer" 
      onClick={() => onView && onView(room)}
    >
      <div className="relative h-44 overflow-hidden">
        <Image 
          src={imgSrc} 
          alt={room.name ||  'Room Image'} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600');
          }}
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
        <div className="absolute top-4 right-4 theme-card text-amber-900 dark:text-amber-500 bg-white/95 dark:bg-[#1C1410]/95 text-xs font-bold px-3 py-1.5 rounded-lg border">
          ${ room.hourlyRate}/hr
        </div>
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
          <MapPin size={11} /> Floor {room.floor}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-bold theme-text text-base">{room.name || 'Unnamed Room'}</h3>
          <p className="theme-text-muted text-sm mt-1 leading-relaxed line-clamp-2">
            {room.description || 'No description available'}
          </p>
        </div>

        <div className="flex gap-4 text-xs theme-text-muted">
          <span className="flex items-center gap-1">
            <Users size={13} /> { room.capacity || 'N/A'} seats
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {room.openHours || '8am'}-{room.closeHours || '8pm'}
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 size={13} /> {room.bookings || 0}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {room.amenities && room.amenities.slice(0, 3).map(a => (
            <span key={a} className={`text-xs px-2 py-0.5 rounded-full font-medium ${AMENITY_COLORS[a] || 'bg-gray-100 text-gray-600'}`}>
              {a}
            </span>
          ))}
          {room.amenities && room.amenities.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              +{room.amenities.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 flex gap-2">
        
        <Link
          href={`/rooms/${room._id}`}
          className="flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold text-sm hover:shadow-lg transition-all">
            View Details
          </button>
        </Link>
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            setIsSaved(!isSaved);
            onSave && onSave(room._id || room.id);
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border`}
          style={{
            background: isSaved ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
            borderColor: isSaved ? 'var(--amber-light)' : 'var(--border-color)',
            color: isSaved ? 'var(--amber-dark)' : 'var(--text-secondary)',
          }}
        >
          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}
