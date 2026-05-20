"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, X, Menu, Sun, Moon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const Navber = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  const { 
        data: session//refetch the session
    } = authClient.useSession() 
  // console.log(session);
  const user = session?.user;
  const isAuthenticated = mounted && !!session;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Load initial theme from localStorage safely and set mounted state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  // Generate custom JWT for the backend (Assignment requirement)
  useEffect(() => {
    if (session?.user) {
      const hasJwt = localStorage.getItem('hasCustomJwt');
      if (!hasJwt) {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/jwt`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email, id: session.user.id })
        }).then(() => {
          localStorage.setItem('hasCustomJwt', 'true');
        }).catch(console.error);
      }
    } else if (session === null) {
      localStorage.removeItem('hasCustomJwt');
    }
  }, [session]);

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

  const handleSignOut = async () => {
    try {
      // Clear custom JWT cookie from backend
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout`, { method: 'POST', credentials: 'include' });
      localStorage.removeItem('hasCustomJwt');

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/signin");
            setIsDropdownOpen(false);
            setIsOpen(false);
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

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
        <ul className="hidden lg:flex items-center gap-2 text-sm font-medium">
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


          {isAuthenticated && (
            <>
              <li>
                <Link  href="/add-room" className={getLinkClass("/add-room")}>
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
        <div className="hidden lg:flex items-center gap-3 relative">
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
            (() => {
              const safeCallback = (pathname === "/signin" || pathname === "/register") ? "/" : pathname;
              return (
            <div className="flex gap-3 text-sm font-semibold">
              <Link href={`/signin?callbackUrl=${encodeURIComponent(safeCallback)}`} className={
                pathname === "/signin" 
                  ? "px-6 py-2.5 rounded-full font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "px-6 py-2.5 border theme-border rounded-full theme-text hover:bg-amber-500/10 transition-all font-semibold"
              }>
                Login
              </Link>
              <Link href={`/register?callbackUrl=${encodeURIComponent(safeCallback)}`} className={
                pathname === "/register"
                 ? "px-6 py-2.5 rounded-full font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "px-6 py-2.5 border theme-border rounded-full theme-text hover:bg-amber-500/10 transition-all font-semibold"
              }>
                Register
              </Link>
            </div>
              );
            })()
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-gray-200 dark:border-amber-900/30 py-1 px-3 pr-2 rounded-full bg-white dark:bg-amber-950/10 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#E58B19] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                  {user?.image ? (
                    <Image referrerPolicy="no-referrer" width={200} height={200} src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{user?.name}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="px-6 py-2.5 border border-red-200 dark:border-red-900/30 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-semibold text-sm cursor-pointer shadow-sm bg-white dark:bg-[#18181b]"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
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
        <div className="lg:hidden mt-4 border-t theme-border pt-4 flex flex-col gap-3 w-full">
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
                <div className="w-10 h-10 rounded-full bg-[#E58B19] text-white flex items-center justify-center font-bold overflow-hidden">
                  {user?.image ? (
                    <Image referrerPolicy="no-referrer"  width={200} height={200} src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <span className="text-sm font-semibold theme-text">{user?.name}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full text-center py-3 border border-red-100 dark:border-red-900/30 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              {(() => {
                const safeCallback = (pathname === "/signin" || pathname === "/register") ? "/" : pathname;
                return (
                  <>
              <Link href={`/signin?callbackUrl=${encodeURIComponent(safeCallback)}`} className={
                pathname === "/signin" 
                  ? "flex-1 text-center py-2.5 rounded-xl font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "flex-1 text-center py-2.5 border theme-border rounded-xl theme-text hover:bg-amber-500/10 font-semibold transition-all"
              } onClick={toggleMenu}>
                Login
              </Link>
              <Link href={`/register?callbackUrl=${encodeURIComponent(safeCallback)}`} className={
                pathname === "/register"
                  ? "flex-1 text-center py-2.5 rounded-xl font-semibold transition-all bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]"
                  : "flex-1 text-center py-2.5 border theme-border rounded-xl theme-text hover:bg-amber-500/10 font-semibold transition-all"
              } onClick={toggleMenu}>
                Register
              </Link>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </nav>
  </div>
  );
};

export default Navber;
