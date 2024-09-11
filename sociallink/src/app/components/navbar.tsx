'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '/static/logo.png';
import SpotlightEffect from './utils/spotlight';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string): boolean => pathname === path;

  return (
    <nav className="border-b-2 border-zinc-800 sticky top-0 backdrop-blur-lg bg-opacity-70 z-50 animate-fade-down animate-once animate-duration-1000 animate-delay-0">
      <div className="flex mx-auto justify-between max-w-[1000px] py-4 items-center">
        <div className="">
            <a href="/"><img src="/static/logo.png" className='w-32 h-auto'></img></a>
        </div>
        <div className="flex font-bold space-x-8 text-l text-zinc-300 items-center">
          <div className={isActive("/") ? "text-white/60" : "hover:text-white transition duration-300"}>
            <a className="hover:text-white transition duration-300" href="/#">Home</a>
          </div>
          <div className=""><a className="hover:text-white transition duration-300" href="/#">Store</a></div>
          <div className=""><a className="hover:text-white transition duration-300" href="/#">Discord</a></div>
          <SpotlightEffect>
            <a href="#/">
                <div className="flex items-center bg-white py-1 px-2 rounded-xl transition duration-300">
                  <i className="fas fa-right-to-bracket mr-2 text-black fa-lg"></i>
                  <p className="text-black font-extrabold text-base">Log in</p>
                  {/* <p className="text-black font-extrabold text-base">Dashboard</p> */}
                </div>
            </a>
          </SpotlightEffect>
        </div>
      </div>
    </nav>
  );
}
