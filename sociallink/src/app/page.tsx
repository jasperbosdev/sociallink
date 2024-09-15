'use client';

import ParticleEffectComponent from './components/utils/particles';
import { Tilt } from 'react-next-tilt';

export default function Home() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">

        <div className="flex flex-col text-center items-center">
          <p className="text-6xl font-bold bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 
          bg-clip-text text-transparent animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]"
          >Komako &gt;w&lt;</p>
          <p className="mt-1 font-bold text-white/60 animate-fade-up animate-once animate-duration-[1800ms] animate-delay-[600ms]"
          >Build your profile, link your socials, and share your world in one place!</p>
        </div>

        <div className="relative flex justify-center w-2/3">
          <svg height="90%" width="60%" className="absolute left-0 top-[50%] z-10 translate-y-[-50%] rotate-6 text-indigo-600/50 opacity-100 blur-[60px]
          animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]">
            <ellipse cx="50%" cy="50%" ry="50%" rx="50%" fill="currentColor"></ellipse>
          </svg>

          <div className="absolute top-0 left-0 w-full h-full z-15 pointer-events-none">
            <ParticleEffectComponent className="w-full h-full animate-fade animate-once animate-duration-[2800ms] animate-delay-[400ms]" />
          </div>

          <svg height="90%" width="70%" className="absolute right-0 top-[50%] z-10 translate-y-[-50%] text-[hsla(0_80%_51%_/_20%)] opacity-100 blur-[60px]
          animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]">
            <ellipse cx="50%" cy="50%" ry="50%" rx="50%" fill="currentColor"></ellipse>
          </svg>

          <Tilt className="w-2/6 z-20" lineGlareEnable={false} tiltReverse={false} spotGlareEnable={false}>
            <img src="./static/images/placeholderc.png" className="w-full animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]" />
          </Tilt>
        </div>

        <div className="flex flex-col animate-fade-up animate-once animate-duration-[1500ms] animate-delay-[2100ms]">
          <p className="font-bold text-white/60">
            Bla bla bla, blu blu blu, bleh bleh bleh...
          </p>
          <div className="flex justify-center space-x-10 mt-5">
            <a href="#/">
            <div className="relative bg-neutral-950 rounded-xl p-0.5 transition-all duration-[300ms] ease-in-out hover:bg-white/60">
              <div className="flex items-center bg-neutral-950 py-1 px-4 rounded-xl transition duration-300">
                <i className="fas fa-tags mr-2 text-white fa-lg"></i>
                <p className="text-white font-bold text-sm uppercase">Store</p>
              </div>
            </div>
            </a>
            {/* <a href="/#">
              <div className="flex items-center bg-neutral-950 py-2 px-5 rounded-xl transition duration-300">
                <i className="fas fa-store mr-2 text-white fa-lg"></i>
                <p className="text-white font-bold text-sm uppercase">Store</p>
              </div>
            </a> */}
          </div>
        </div>
        
        <div className="flex flex-col text-center space-y-6 animate-fade-up animate-once animate-duration-[1500ms] animate-delay-[2900ms]">
          <p className="font-bold text-white/60">
            Learn More
          </p>
          <div className="animate-bounce animate-infinite">
            <i className='fas fa-arrow-down fa-2xl text-white/60'></i>
          </div>
        </div>

      </div>
    </>
  );
}