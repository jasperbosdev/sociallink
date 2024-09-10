'use client';

import { Tilt } from 'react-next-tilt';

export default function Home() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">

        <div className="flex flex-col text-center items-center">
          <p className="text-6xl font-bold bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 
          bg-clip-text text-transparent animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]"
          >Komako &gt;w&lt;</p>
          <p className="mt-1 font-bold text-white/60 animate-fade-up animate-once animate-duration-[1800ms] animate-delay-[900ms]"
          >Build your profile, link your socials, and share your world in one place!</p>
        </div>

        <div className="relative flex justify-center py-10">

          <svg height="90%" width="60%" className="absolute left-0 top-[50%] z-10 translate-y-[-50%] rotate-6 text-indigo-600/50 opacity-100 blur-[60px] animate-fadeInSlow">
            <ellipse cx="50%" cy="50%" ry="50%" rx="50%" fill="currentColor"></ellipse>
          </svg>
          
          <svg height="90%" width="70%" className="absolute right-0 top-[50%] z-10 translate-y-[-50%] text-[hsla(0_80%_51%_/_20%)] opacity-100 blur-[60px] animate-fadeInSlow">
            <ellipse cx="50%" cy="50%" ry="50%" rx="50%" fill="currentColor"></ellipse>
          </svg>

          {/* Image with Tilt effect */}
          <Tilt className="w-2/6 z-20" lineGlareEnable={false} tiltReverse={true}>
            <img src="./static/images/placeholdera.png" className="w-full" />
          </Tilt>
        </div>

      </div>
    </>
  );
}