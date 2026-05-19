'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  AlignLeft,
  Pencil,
  X,
  Check
} from 'lucide-react';
import {
  TextField,
  Label,
  InputGroup,
  Button,
  Card
} from '@heroui/react';
import toast from 'react-hot-toast';

const amenitiesList = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

export default function EditModalForm({ room, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    roomName: room.name || '',
    description: room.description || '',
    image: room.imageUrl || '',
    floor: room.floor || '',
    capacity: room.capacity || '',
    hourlyRate: room.hourlyRate || '',
    amenities: room.amenities || [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (amenity) => {
    setFormData((prev) => {
      const isSelected = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: isSelected
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Map form fields to API schema
      const mappedData = {
        name: formData.roomName,
        description: formData.description,
        imageUrl: formData.image,
        floor: formData.floor,
        capacity: formData.capacity,
        hourlyRate: formData.hourlyRate,
        amenities: formData.amenities || []
      };

      const res = await fetch(`http://localhost:5000/room/${room._id || room.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedData),
      });
      const data = await res.json();
      console.log(data);    
      if (!res.ok) throw new Error('Failed to update room');
      toast.success('Room updated successfully!');
      onUpdated && onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card
            className="theme-card rounded-[2rem] border shadow-none overflow-hidden p-0"
            shadow="none"
          >
            {/* Header */}
            <div className="bg-amber-500/10 dark:bg-amber-950/20 px-8 py-7 relative overflow-hidden border-b theme-border flex items-start justify-between gap-4">
              {/* Grid BG pattern */}
              <div className="absolute inset-0 opacity-[0.03] text-[#E58B19]">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="edit-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#edit-grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 border border-[#E58B19]/30 rounded-full px-3 py-1 text-xs font-semibold text-[#FBBF24] bg-[#E58B19]/10 mb-3 backdrop-blur-sm">
                  <Pencil size={12} /> Edit Room
                </div>
                <h2
                  className="text-2xl font-bold theme-text"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Update{' '}
                  <span className="text-[#E58B19] dark:text-[#FBBF24]">
                    {room.name || 'Room'}
                  </span>
                </h2>
                <p className="theme-text-muted text-sm mt-1">
                  Make changes and save to update this study room.
                </p>
              </div>

              {/* Close btn */}
              <button
                onClick={onClose}
                className="relative z-10 mt-1 p-2 rounded-xl theme-text-muted hover:bg-amber-500/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="px-8 py-8 flex flex-col gap-6 theme-text">

                {/* Name */}
                <TextField isRequired className="w-full flex flex-col gap-1.5">
                  <Label className="block text-sm font-semibold theme-text-muted">Name</Label>
                  <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input rounded-xl">
                    <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                      <Building2 size={18} />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      name="roomName"
                      placeholder="e.g. The Birch Room"
                      value={formData.roomName}
                      onChange={handleChange}
                      className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                    />
                  </InputGroup>
                </TextField>

                {/* Description */}
                <TextField isRequired className="w-full flex flex-col gap-1.5">
                  <Label className="block text-sm font-semibold theme-text-muted">Description</Label>
                  <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input rounded-xl">
                    <InputGroup.Prefix className="pl-3 pr-2 pt-3 text-gray-400 flex items-start">
                      <AlignLeft size={18} />
                    </InputGroup.Prefix>
                    <InputGroup.TextArea
                      name="description"
                      placeholder="Describe the room…"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                    />
                  </InputGroup>
                </TextField>

                {/* Image URL */}
                <TextField className="w-full flex flex-col gap-1.5">
                  <Label className="block text-sm font-semibold theme-text-muted">Image URL</Label>
                  <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input rounded-xl">
                    <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                      <ImageIcon size={18} />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      type="url"
                      name="image"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={handleChange}
                      className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                    />
                  </InputGroup>
                </TextField>

                {/* Floor / Capacity / Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField className="w-full flex flex-col gap-1.5">
                    <Label className="block text-sm font-semibold theme-text-muted">Floor</Label>
                    <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input rounded-xl">
                      <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                        <MapPin size={18} />
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        name="floor"
                        placeholder="e.g. 3rd Floor"
                        value={formData.floor}
                        onChange={handleChange}
                        className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                      />
                    </InputGroup>
                  </TextField>

                  <TextField isRequired className="w-full flex flex-col gap-1.5">
                    <Label className="block text-sm font-semibold theme-text-muted">Capacity</Label>
                    <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input rounded-xl">
                      <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                        <Users size={18} />
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        type="number"
                        name="capacity"
                        placeholder="e.g. 4"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                      />
                    </InputGroup>
                  </TextField>

                  <TextField isRequired className="w-full flex flex-col gap-1.5">
                    <Label className="block text-sm font-semibold theme-text-muted">Hourly Rate ($)</Label>
                    <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input rounded-xl">
                      <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                        <DollarSign size={18} />
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        type="number"
                        name="hourlyRate"
                        placeholder="e.g. 5"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                      />
                    </InputGroup>
                  </TextField>
                </div>

                {/* Amenities */}
                <div>
                  <Label className="block text-sm font-semibold theme-text-muted mb-3">Amenities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => {
                      const isChecked = formData.amenities.includes(amenity);
                      return (
                        <label
                          key={amenity}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-[#E58B19] bg-[#E58B19]/10'
                              : 'theme-border bg-amber-500/5 hover:bg-amber-500/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(amenity)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isChecked ? 'border-[#E58B19] bg-[#E58B19]' : 'border-[#E58B19] bg-transparent'
                            }`}
                          >
                            {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#1C1410]" />}
                          </div>
                          <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-[#E58B19] dark:text-[#FBBF24]' : 'theme-text-muted'}`}>
                            {amenity}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 flex justify-end gap-3 border-t theme-border bg-amber-500/5 dark:bg-amber-950/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold theme-text-muted hover:bg-amber-500/10 transition-all"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="bg-[#E58B19] hover:bg-[#D97706] text-white font-semibold shadow-lg shadow-[#E58B19]/20 px-8 py-3"
                  radius="full"
                  size="lg"
                  endContent={!loading && <Check size={18} strokeWidth={2.5} />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
