'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import SpotlightEffect from './utils/spotlight';
import { useSupabase } from './utils/SupabaseProvider';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { session } = useSupabase();

  const isActive = (path: string): boolean => pathname === path;

  return (
    <div id="nav">
      <nav className="px-8 border-b-2 border-zinc-800 sticky top-0 backdrop-blur-lg bg-opacity-70 z-50 animate-fade-down animate-once animate-duration-1000 animate-delay-0">
        <div className="flex flex-col md:flex-row mx-auto justify-between max-w-[1000px] py-4 items-center">
          {/* Top Row: Logo and Hamburger */}
          <div className="flex justify-between w-full md:w-auto items-center">
            <a href="/">
              <img src="/static/logo.png" className="w-24 md:w-32 h-auto" alt="Logo" />
            </a>
            <button
              className="block md:hidden text-zinc-300 hover:text-white transition duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} fa-lg`}></i>
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`${
              isMenuOpen ? 'flex' : 'hidden'
            } flex-col md:flex-row md:flex md:space-x-8 space-y-4 mt-4 md:mt-0 font-bold text-l text-zinc-300 items-center w-full md:w-auto`}
          >
            <div className={isActive("/") ? "text-white/60" : "hover:text-white transition duration-300"}>
              <a href="/#">Home</a>
            </div>
            <div>
              <a className="hover:text-white transition duration-300" href="/#">Store</a>
            </div>
            <div>
              <a className="hover:text-white transition duration-300" href="/#">Discord</a>
            </div>
            <div>
              <a className="hover:text-white transition duration-300" target="_blank" href="https://ko-fi.com/leeuwz">
                Support
              </a>
            </div>
            <SpotlightEffect>
              {session ? (
                <a href="/dashboard">
                  <div className="flex items-center bg-white py-1 px-2 rounded-xl transition duration-300">
                    <i className="fas fa-address-card mr-2 text-black fa-lg"></i>
                    <p className="text-black font-extrabold text-base">Dashboard</p>
                  </div>
                </a>
              ) : (
                <a href="/login">
                  <div className="flex items-center bg-white py-1 px-2 rounded-xl transition duration-300">
                    <i className="fas fa-right-to-bracket mr-2 text-black fa-lg"></i>
                    <p className="text-black font-extrabold text-base">Log in</p>
                  </div>
                </a>
              )}
            </SpotlightEffect>
          </div>
        </div>
      </nav>
    </div>
  );
}