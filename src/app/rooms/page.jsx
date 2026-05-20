'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import RoomCard from '@/components/RoomCard';

const COLORS = {
  amberDark: '#D97706',
  border: '#FDE68A',
};

const AMENITY_LIST = [
  'Wi-Fi',
  'Quiet Zone',
  'Projector',
  'Whiteboard',
  'Power Outlets',
  'Air Conditioning',
];

const SORT_OPTIONS = [
  { value: 'latest',       label: 'Sort: Latest first' },
  { value: 'price-low',    label: 'Price: Low to high' },
  { value: 'price-high',   label: 'Price: High to low' },
  { value: 'most-booked',  label: 'Most booked' },
];

// ── Skeleton ────────────────────────────────────────────────────────────────
function RoomSkeleton() {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="h-44 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
        <div className="h-8 bg-gray-200 rounded-xl animate-pulse mt-4" />
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [minRate, setMinRate] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Debounce search input (400ms)
  const debounceTimer = useRef(null);
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  // Build query string & fetch whenever any filter changes
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (amenities.length > 0) params.set('amenities', amenities.join(','));
      if (minRate)  params.set('minRate', minRate);
      params.set('sort', sortBy);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room?${params.toString()}`);
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);

      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.rooms || data.data || [];
      setRooms(arr);
      setTotalCount(arr.length);
    } catch (err) {
      setError(err.message || 'Failed to fetch rooms.');
      toast.error('Failed to load rooms: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, amenities, minRate, sortBy]);

  useEffect(() => {
    const run = async () => {
      await fetchRooms();
    };
    run();
  }, [fetchRooms]);

  const toggleAmenity = (amenity) =>
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setAmenities([]);
    setMinRate('');
  };

  const hasActiveFilters = search || amenities.length > 0 || minRate;

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort: Latest first';

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold theme-text mb-2">All Study Rooms</h1>
      <p className="theme-text-muted mb-10">
        Discover every available focus space across the campus library.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ── Sidebar ── */}
        <aside className="w-full md:w-56 shrink-0 space-y-4">
          {/* Mobile toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer shadow-sm text-sm"
          >
            <SlidersHorizontal size={15} />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block space-y-4`}>
            {/* Search */}
            <div className="theme-card border rounded-2xl p-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3" color={COLORS.amberDark} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rooms…"
                  className="w-full pl-9 pr-4 py-2 rounded-lg border theme-input text-sm outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="theme-card border rounded-2xl p-4">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide mb-4">
                Amenities
              </h3>
              <div className="space-y-2.5">
                {AMENITY_LIST.map((a) => (
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

            {/* Rate Filter */}
            <div className="theme-card border rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wide">
                Hourly Rate
              </h3>
              <div>
                <label className="text-xs theme-text-muted mb-1 block">Min ($)</label>
                <input
                  type="number"
                  min={0}
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-1.5 rounded-lg border theme-input text-sm outline-none"
                  style={{ accentColor: COLORS.amberDark }}
                />
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
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

        {/* ── Main Content ── */}
        <div className="flex-1">
          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <RoomSkeleton key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Connection Error</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={fetchRooms}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && rooms.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold theme-text mb-2">No rooms match your filters</h3>
              <p className="theme-text-muted text-sm mb-6">
                Try adjusting your search or clearing some filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && rooms.length > 0 && (
            <>
              {/* Toolbar */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-sm theme-text-muted">
                  Showing <strong className="theme-text">{rooms.length}</strong> room{rooms.length !== 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="ml-3 text-xs text-amber-600 dark:text-amber-500 hover:underline font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </span>

                {/* Sort dropdown */}
                <div className="relative w-full sm:w-auto z-20">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border theme-input text-sm w-full sm:w-56 transition-all outline-none cursor-pointer theme-text font-medium"
                  >
                    <span>{currentSortLabel}</span>
                    <ChevronDown
                      size={16}
                      className={`text-amber-800 dark:text-amber-500 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                      <div className="absolute right-0 mt-2 w-full sm:w-56 theme-card border rounded-xl shadow-xl py-1.5 z-20 overflow-hidden">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                              sortBy === opt.value
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 font-semibold'
                                : 'theme-text hover:bg-amber-50/30 dark:hover:bg-amber-950/10'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {sortBy === opt.value && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, index) => (
                  <RoomCard
                    key={room._id || room.id || index}
                    room={room}
                    onSave={() => toast.success('Room saved to favorites')}
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