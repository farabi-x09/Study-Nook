"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  AlignLeft,
  Plus
} from 'lucide-react';
import {
  TextField,
  Label,
  InputGroup,
  Checkbox,
  Button,
  Card
} from "@heroui/react";
import toast from 'react-hot-toast';

const AddRoomPage = () => {



  const [formData, setFormData] = useState({
    roomName: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    hourlyRate: '',
    amenities: []
  });

  const amenitiesList = [
    'Whiteboard',
    'Projector',
    'Wi-Fi',
    'Power Outlets',
    'Quiet Zone',
    'Air Conditioning'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (amenity) => {
    setFormData((prev) => {
      const isSelected = prev.amenities.includes(amenity);
      if (isSelected) {
        return {
          ...prev,
          amenities: prev.amenities.filter((item) => item !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const room = Object.fromEntries(formData.entries());
    console.log(room);
    // console.log('Submitted Room Data:', formData);
    // TODO: Add API call to save the room

    const res = await fetch('http://localhost:5000/room',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(room),
    } )
    const data = await res.json();
    console.log(data);
      toast.success('Room added successfully');
   
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto"
      >
        <Card className="theme-card rounded-[2rem] shadow-[0_0_50px_-12px_rgba(229,139,25,0.15)] overflow-hidden border p-0" shadow="none">
          {/* Header */}
          <div className="bg-amber-500/10 dark:bg-amber-950/20 px-8 py-10 relative overflow-hidden border-b theme-border">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] text-[#E58B19]">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 border border-[#E58B19]/30 rounded-full px-3 py-1 text-xs font-semibold text-[#FBBF24] bg-[#E58B19]/10 mb-4 backdrop-blur-sm">
                <Plus size={14} />
                List Your Space
              </div>
              <h1 className="text-3xl md:text-4xl font-bold theme-text font-serif mb-2">
                Add a New <span className="text-[#E58B19] dark:text-[#FBBF24]">Study Room</span>
              </h1>
              <p className="theme-text-muted text-sm md:text-base max-w-xl font-light">
                Fill out the form below to list a new study room on StudyNook.
                Make sure to provide accurate details to attract more people.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-8 py-8 flex flex-col gap-6 overflow-visible theme-text">

              {/* Name */}
              <TextField isRequired className="w-full flex flex-col gap-1.5">
                <Label className="block text-sm font-semibold theme-text-muted">Name</Label>
                <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
                  <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                    <Building2 size={18} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    name="roomName"
                    placeholder="e.g. The Birch Room"
                    value={formData.roomName}
                    onChange={handleChange}
                    className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                  />
                </InputGroup>
              </TextField>

              {/* Description */}
              <TextField isRequired className="w-full flex flex-col gap-1.5">
                <Label className="block text-sm font-semibold theme-text-muted">Description</Label>
                <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
                  <InputGroup.Prefix className="pl-3 pr-2 pt-3 align-top text-gray-400 flex items-start">
                    <AlignLeft size={18} />
                  </InputGroup.Prefix>
                  <InputGroup.TextArea
                    name="description"
                    placeholder="Describe the room, its vibe, and what makes it special..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                  />
                </InputGroup>
              </TextField>

              {/* Image URL */}
              <TextField className="w-full flex flex-col gap-1.5">
                <Label className="block text-sm font-semibold theme-text-muted">Image URL</Label>
                <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
                  <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                    <ImageIcon size={18} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    type="url"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                  />
                </InputGroup>
              </TextField>

              {/* Floor, Capacity, Hourly Rate (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <TextField className="w-full flex flex-col gap-1.5">
                  <Label className="block text-sm font-semibold theme-text-muted">Floor</Label>
                  <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
                    <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                      <MapPin size={18} />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      name="floor"
                      placeholder="e.g. 3rd Floor"
                      value={formData.floor}
                      onChange={handleChange}
                      className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                    />
                  </InputGroup>
                </TextField>

                <TextField isRequired className="w-full flex flex-col gap-1.5">
                  <Label className="block text-sm font-semibold theme-text-muted">Capacity</Label>
                  <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
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
                      className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                    />
                  </InputGroup>
                </TextField>

                <TextField isRequired className="w-full flex flex-col gap-1.5">
                  <Label className="block text-sm font-semibold theme-text-muted">Hourly Rate ($)</Label>
                  <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
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
                      className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                    />
                  </InputGroup>
                </TextField>
              </div>

              {/* Amenities */}
              <div className="mt-2">
                <Label className="block text-sm font-semibold theme-text-muted mb-4">Amenities</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {amenitiesList.map((amenity) => {
                    const isChecked = formData.amenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${isChecked
                            ? 'border-[#E58B19] bg-[#E58B19]/10 shadow-[0_0_15px_-3px_rgba(229,139,25,0.1)]'
                            : 'theme-border bg-amber-500/5 hover:bg-amber-500/10'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(amenity)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isChecked
                            ? 'border-[#E58B19] bg-[#E58B19]'
                            : 'border-[#E58B19] bg-transparent'
                          }`}>
                          {isChecked && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#1C1410]" />
                          )}
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
            <div className="px-8 py-6 flex justify-end border-t theme-border bg-amber-500/5 dark:bg-amber-950/20">
              <Button
                type="submit"
                className="bg-[#E58B19] hover:bg-[#D97706] text-white font-semibold shadow-lg shadow-[#E58B19]/20 px-8 py-3.5"
                radius="full"
                size="lg"
                endContent={<Plus size={18} strokeWidth={2.5} />}
              >
                Publish Room
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddRoomPage;
