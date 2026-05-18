import React from 'react';
import Link from 'next/link';
import { Home, Mail, Phone } from 'lucide-react';
import { FaFacebook, FaXTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-yellow-200 mt-16 pt-12 pb-6 font-sans relative z-10">
      <div className="w-11/12 max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2.5 items-center">
              <div className="bg-[#E58B19] rounded-xl p-2 flex justify-center items-center text-white shadow-sm">
                <Home size={24} strokeWidth={2} />
              </div>
              <h3 className="font-extrabold text-2xl tracking-tight text-gray-800">
                Study<span className="text-[#E58B19]">Nook</span>
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 max-w-sm">
              Your ultimate platform for finding and booking the perfect study room. Discover quiet spaces, collaborate, and boost your productivity.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Useful Links</h4>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-[#E58B19] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-gray-500 hover:text-[#E58B19] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Rooms
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-[#E58B19] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Socials */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 mb-6">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#E58B19] shrink-0" />
                <a href="mailto:farabiahmed2005@gmail.com" className="hover:text-[#E58B19] transition-colors">farabiahmed2005@gmail.com
</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#E58B19] shrink-0" />
                <a href="tel:+8801570203520" className="hover:text-[#E58B19] transition-colors">01570203520</a>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/farabi76o" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#E58B19] hover:text-white hover:border-[#E58B19] transition-all" aria-label="Facebook">
                <FaFacebook size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#E58B19] hover:text-white hover:border-[#E58B19] transition-all" aria-label="X (Twitter)">
                <FaXTwitter size={18} />
              </a>
              <a href="https://www.linkedin.com/in/farabi-ahmed13/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#E58B19] hover:text-white hover:border-[#E58B19] transition-all" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
              <a href="https://www.instagram.com/farabi7i" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#E58B19] hover:text-white hover:border-[#E58B19] transition-all" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-6 border-t border-gray-100 flex justify-center items-center text-sm text-gray-400">
          <p>Copyright © {new Date().getFullYear()} StudyNook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
