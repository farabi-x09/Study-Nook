"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronDown, X, Menu, Sun, Moon } from "lucide-react";

const Navber = ({ isAuthenticated = false, user = { name: "Alex M.", initial: "A" } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");

  // Load initial theme from localStorage safely
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
  }, []);

  // Apply theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const getLinkClass = (path) => {
    const base = "px-4 py-2 rounded-lg transition-all duration-250";
    return pathname === path
      ? `${base} bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24] font-semibold`
      : `${base} theme-text-muted hover:bg-amber-500/10 hover:text-amber-500`;
  };

  const getMobileLinkClass = (path) => {
    const base = "block px-4 py-3 rounded-xl transition-all duration-250";
    return pathname === path
      ? `${base} bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24] font-semibold`
      : `${base} theme-text-muted hover:bg-amber-500/10 hover:text-amber-500`;
  };

  return (
    <div className="w-full sticky top-0 z-50 flex justify-center px-4 py-2">
      <nav className="theme-card border shadow-md rounded-2xl px-4 lg:px-6 py-3 w-full max-w-7xl font-sans">
      <div className="flex justify-between items-center w-full">

        {/* Logo Section */}
        <div className="flex gap-2.5 items-center">
          <div className="bg-[#E58B19] rounded-xl p-2 flex justify-center items-center text-white shadow-sm">
            <Home size={20} strokeWidth={2} />
          </div>
          <h3 className="font-extrabold text-xl tracking-tight theme-text">
            Study<span className="text-[#E58B19]">Nook</span>
          </h3>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-2 text-sm font-medium">
          <li>
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/rooms" className={getLinkClass("/rooms")}>
              Rooms
            </Link>
          </li>

          {/* add tre romm for cheak */}

          <li>
            <Link href="/add-room" className={getMobileLinkClass("/add-room")} onClick={toggleMenu}>
              Add Room
            </Link>
          </li>


          {/* end */}
          {isAuthenticated && (
            <>
              <li>
                <Link href="/add-room" className={getLinkClass("/add-room")}>
                  Add Room
                </Link>
              </li>
              <li>
                <Link href="/my-listings" className={getLinkClass("/my-listings")}>
                  My Listings
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className={getLinkClass("/my-bookings")}>
                  My Bookings
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Desktop Auth / User Links */}
        <div className="hidden md:flex items-center gap-3 relative">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-amber-900/30 rounded-xl text-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all cursor-pointer shadow-sm bg-white dark:bg-amber-950/10"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Sun size={18} strokeWidth={2.2} />
            ) : (
              <Moon size={18} strokeWidth={2.2} className="text-amber-400" />
            )}
          </button>

          {!isAuthenticated ? (
            <div className="flex gap-3 text-sm font-semibold">
              <Link href="/signin" className={
                pathname === "/signin" 
                  ? "px-6 py-2.5 rounded-full font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "px-6 py-2.5 border theme-border rounded-full theme-text hover:bg-amber-500/10 transition-all font-semibold"
              }>
                Login
              </Link>
              <Link href="/register" className={
                pathname === "/register"
                 ? "px-6 py-2.5 rounded-full font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "px-6 py-2.5 border theme-border rounded-full theme-text hover:bg-amber-500/10 transition-all font-semibold"
              }>
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 border border-gray-200 py-1 px-3 pr-2 rounded-full bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#E58B19] text-white flex items-center justify-center font-bold text-sm">
                  {user.initial}
                </div>
                <span className="text-sm font-semibold text-gray-700 ml-1">{user.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 flex flex-col z-50">
                  <Link href="/my-listings" className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    My Listings
                  </Link>
                  <Link href="/my-bookings" className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    My Bookings
                  </Link>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 text-left transition-colors">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle Button (Mobile) */}
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-amber-900/30 rounded-xl text-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all cursor-pointer bg-white dark:bg-amber-950/10"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Sun size={18} strokeWidth={2.2} />
            ) : (
              <Moon size={18} strokeWidth={2.2} className="text-amber-400" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex justify-center items-center border border-gray-200 dark:border-amber-900/30 rounded-xl text-gray-600 dark:text-gray-300 focus:outline-none hover:bg-gray-50 dark:hover:bg-amber-950/20 transition-colors bg-white dark:bg-amber-950/10"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X size={20} strokeWidth={2} />
            ) : (
              <Menu size={20} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (Drawer) */}
      {isOpen && (
        <div className="md:hidden mt-4 border-t theme-border pt-4 flex flex-col gap-3 w-full">
          <ul className="flex flex-col gap-1.5 text-sm font-medium">
            <li>
              <Link href="/" className={getMobileLinkClass("/")} onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/rooms" className={getMobileLinkClass("/rooms")} onClick={toggleMenu}>
                Rooms
              </Link>
            </li>

             {/* add tre romm for cheak */}

          <li>
            <Link href="/add-room" className={getMobileLinkClass("/add-room")} onClick={toggleMenu}>
              Add Room
            </Link>
          </li>


          {/* end */}
          
            {isAuthenticated && (
              <>
                <li>
                  <Link href="/add-room" className={getMobileLinkClass("/add-room")} onClick={toggleMenu}>
                    Add Room
                  </Link>
                </li>
                <li>
                  <Link href="/my-listings" className={getMobileLinkClass("/my-listings")} onClick={toggleMenu}>
                    My Listings
                  </Link>
                </li>
                <li>
                  <Link href="/my-bookings" className={getMobileLinkClass("/my-bookings")} onClick={toggleMenu}>
                    My Bookings
                  </Link>
                </li>
              </>
            )}
          </ul>

          {isAuthenticated ? (
            <div className="flex flex-col gap-3 mt-2 pt-4 border-t theme-border">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-[#E58B19] text-white flex items-center justify-center font-bold">
                  {user.initial}
                </div>
                <span className="text-sm font-semibold theme-text">{user.name}</span>
              </div>
              <button className="w-full text-center py-3 border border-red-100 dark:border-red-900/30 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-semibold">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <Link href="/signin" className={
                pathname === "/signin" 
                  ? "flex-1 text-center py-2.5 rounded-xl font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "flex-1 text-center py-2.5 border theme-border rounded-xl theme-text hover:bg-amber-500/10 font-semibold transition-all"
              } onClick={toggleMenu}>
                Login
              </Link>
              <Link href="/register" className={
                pathname === "/register"
                  ? "flex-1 text-center py-2.5 rounded-xl font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "flex-1 text-center py-2.5 border theme-border rounded-xl theme-text hover:bg-amber-500/10 font-semibold transition-all"
              } onClick={toggleMenu}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  </div>
  );
};

export default Navber;
