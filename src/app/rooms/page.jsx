

'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import RoomCard from '@/components/RoomCard';

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


// Skeleton Loader
function RoomSkeleton() {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="h-44 bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded-xl animate-pulse mt-4"></div>
      </div>
    </div>
  );
}

// Main RoomsPage Component
function RoomsPage({ setSelectedRoom, setPage }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [maxRate, setMaxRate] = useState(20);
  const [sortBy, setSortBy] = useState('latest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/room');
        
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Fetched rooms:', data);
        
        // Handle both array and object responses
        const roomsArray = Array.isArray(data) ? data : data.rooms || data.data || [];
        
        if (roomsArray.length === 0) {
          toast.info('No rooms available at the moment');
        }
        
        setRooms(roomsArray);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch rooms. Make sure the backend is running on http://localhost:5000');
        toast.error('Failed to load rooms: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Apply filters and sorting during rendering using useMemo
  const filteredRooms = useMemo(() => {
    let filtered = rooms;

    // Search filter
    if (search) {
      filtered = filtered.filter(r => {
        const name = r.name || r.roomName || '';
        return name.toLowerCase().includes(search.toLowerCase());
      });
    }

    // Amenities filter
    if (amenities.length > 0) {
      filtered = filtered.filter(r => 
        amenities.every(a => {
          if (!r.amenities) return false;
          // Support both "Air Con" and "Air Conditioning" variants interchangeably
          if (a === 'Air Conditioning' || a === 'Air Con') {
            return r.amenities.includes('Air Conditioning') || r.amenities.includes('Air Con');
          }
          return r.amenities.includes(a);
        })
      );
    }

    // Price filter
    const rate = r => r.rate || r.hourlyRate || 0;
    filtered = filtered.filter(r => rate(r) <= maxRate);

    // Apply sorting
    const sorted = [...filtered];
    if (sortBy === 'latest') {
      sorted.sort((a, b) => {
        const idA = a._id || a.id || '';
        const idB = b._id || b.id || '';
        return idB.localeCompare(idA); // Descending order of id (latest first)
      });
    } else if (sortBy === 'price-low') {
      sorted.sort((a, b) => rate(a) - rate(b));
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => rate(b) - rate(a));
    } else if (sortBy === 'most-booked') {
      sorted.sort((a, b) => (b.bookings || 0) - (a.bookings || 0));
    } else if (sortBy === 'highest-rated') {
      // Fallback to bookings/rate if rating not defined
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.bookings || 0) - (a.bookings || 0));
    }

    return sorted;
  }, [search, amenities, maxRate, rooms, sortBy]);

  const toggleAmenity = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setAmenities([]);
    setMaxRate(20);
  };

  const handleRoomView = (room) => {
    setSelectedRoom?.(room);
    setPage?.('room-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold theme-text mb-2">All Study Rooms</h1>
      <p className="theme-text-muted mb-10">Discover every available focus space across the campus library.</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-4">
          {/* Mobile Filter Toggle Button */}
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)} 
            className="md:hidden w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer shadow-sm text-sm"
          >
            <SlidersHorizontal size={15} />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters List */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block space-y-4`}>
            {/* Search */}
            <div className="theme-card border rounded-2xl p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3" color={COLORS.amberDark} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search rooms…"
                className="w-full pl-9 pr-4 py-2 rounded-lg border theme-input text-base sm:text-sm outline-none"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="theme-card border rounded-2xl p-4">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide mb-4">Amenities</h3>
            <div className="space-y-2.5">
              {['Wi-Fi', 'Quiet Zone', 'Projector', 'Whiteboard', 'Power Outlets', 'Air Conditioning'].map(a => (
                <label key={a} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: COLORS.amberDark }}
                  />
                  <span className="text-sm theme-text-muted">{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="theme-card border rounded-2xl p-4">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide mb-4">Max Rate</h3>
            <input
              type="range"
              min={1}
              max={20}
              value={maxRate}
              onChange={e => setMaxRate(+e.target.value)}
              className="w-full cursor-pointer"
              style={{ accentColor: COLORS.amberDark }}
            />
            <div className="text-sm font-bold text-amber-700 dark:text-amber-500 mt-2">${maxRate}/hr</div>
          </div>

          {/* Clear Filters */}
          {(amenities.length > 0 || search) && (
            <button
              onClick={clearFilters}
              className="w-full py-2 rounded-lg text-sm border text-red-600 hover:bg-red-50 transition-colors font-medium"
              style={{ borderColor: '#FCA5A5' }}
            >
              Clear filters
            </button>
          )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <RoomSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Connection Error</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredRooms.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No rooms match your search</h3>
              <p className="text-gray-600 text-sm mb-6">Try adjusting your filters or clearing the search query.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Rooms Grid */}
          {!loading && !error && filteredRooms.length > 0 && (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-sm theme-text-muted">
                  Showing <strong className="theme-text">{filteredRooms.length}</strong> of <strong>{rooms.length}</strong> rooms
                </span>
                <div className="relative w-full sm:w-auto z-20">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border theme-input text-base sm:text-sm w-full sm:w-56 transition-all outline-none cursor-pointer theme-text font-medium"
                  >
                    <span>{
                      sortBy === 'latest' ? 'Sort: Latest first' :
                      sortBy === 'price-low' ? 'Price: Low to high' :
                      sortBy === 'price-high' ? 'Price: High to low' :
                      sortBy === 'most-booked' ? 'Most booked' :
                      sortBy === 'highest-rated' ? 'Highest rated' : 'Sort: Latest first'
                    }</span>
                    <ChevronDown size={16} className={`text-amber-800 dark:text-amber-500 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSortOpen && (
                    <>
                      {/* Click outside overlay to close */}
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                      
                      {/* Options Dropdown Panel */}
                      <div className="absolute right-0 mt-2 w-full sm:w-56 theme-card border rounded-xl shadow-xl py-1.5 z-20 overflow-hidden font-sans">
                        {[
                          { value: 'latest', label: 'Sort: Latest first' },
                          { value: 'price-low', label: 'Price: Low to high' },
                          { value: 'price-high', label: 'Price: High to low' },
                          { value: 'most-booked', label: 'Most booked' },
                          { value: 'highest-rated', label: 'Highest rated' }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                              sortBy === opt.value 
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 font-semibold' 
                                : 'theme-text hover:bg-amber-50/30 dark:hover:bg-amber-950/10'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {sortBy === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room, index) => (
                  <RoomCard
                    key={room._id || room.id || index}
                    room={room}
                    onView={handleRoomView}
                    onSave={(roomId) => toast.success('Room saved to favorites')}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;