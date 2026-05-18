import React from 'react';

const RoomsPage = () => {
  return (
    <div className="w-11/12 max-w-7xl mx-auto pt-8 pb-24">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 font-serif">
        Available <span className="text-[#E58B19]">Rooms</span>
      </h1>
      <p className="text-gray-600 mb-10">
        Browse our selection of quiet, private study rooms tailored for your needs.
      </p>

      {/* Placeholder Grid for Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((room) => (
          <div key={room} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Study Room {room}</h3>
              <p className="text-sm text-gray-500 mb-4">Perfect for focused work or small group meetings.</p>
              <button className="w-full py-2.5 bg-yellow-100/50 text-[#E58B19] font-semibold rounded-xl hover:bg-yellow-100 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
