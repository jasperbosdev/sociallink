'use client';

import ParticleEffectComponent from './components/utils/particles';
import VanillaTilt from 'vanilla-tilt';
import SpotlightEffect from './components/utils/spotlightHome';
import { users } from './components/utils/usersData';

export default function Home() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 max-w-[1280px] mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col text-center items-center">
          <p className="text-6xl font-bold bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 bg-clip-text text-transparent animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]">
            Komako &gt;w&lt;
          </p>
          <p className="mt-1 font-bold text-white/60 animate-fade-up animate-once animate-duration-[1800ms] animate-delay-[600ms]">
            Build your profile, link your socials, and share your world in one place!
          </p>
        </div>

        {/* Spotlight and Particle Effect Section */}
        <div className="relative flex justify-center w-2/3">
          <svg
            height="90%"
            width="60%"
            className="absolute left-0 top-[50%] z-10 translate-y-[-50%] rotate-6 text-indigo-600/50 opacity-100 blur-[60px] animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]"
          >
            <ellipse cx="50%" cy="50%" ry="50%" rx="50%" fill="currentColor"></ellipse>
          </svg>

          <div className="absolute top-0 left-0 w-full h-full z-15 pointer-events-none">
            <ParticleEffectComponent className="w-full h-full animate-fade animate-once animate-duration-[2800ms] animate-delay-[400ms]" />
          </div>

          <svg
            height="90%"
            width="70%"
            className="absolute right-0 top-[50%] z-10 translate-y-[-50%] text-[hsla(0_80%_51%_/_20%)] opacity-100 blur-[60px] animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]"
          >
            <ellipse cx="50%" cy="50%" ry="50%" rx="50%" fill="currentColor"></ellipse>
          </svg>

          <div
            className="w-[24em] z-20 opacity-[0.8]"
            ref={(el) => {
              if (el) {
                VanillaTilt.init(el, {
                  max: 5,
                  speed: 400,
                  glare: false,
                  "max-glare": 0.5,
                  reverse: false,
                });
              }
            }}
          >
            <img
              src="./static/images/profiledemo.png"
              className="select-none w-full animate-fade animate-once animate-duration-[2800ms] animate-delay-[600ms]"
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="flex flex-col animate-fade-up animate-once animate-duration-[1500ms] animate-delay-[1500ms]">
          <p className="font-bold text-white/60 text-center">
            Komako helps you connect with others, and share your online presence.
            <br />
            Offering a wide range of customizability, and features to help you stand out.
          </p>
          <div className="flex justify-center space-x-10 mt-4">
            <a href="#/">
              <div className="relative bg-neutral-950 rounded-xl p-0.5 transition-all duration-[300ms] ease-in-out hover:bg-white/60">
                <div className="flex items-center bg-neutral-950 py-1 px-4 rounded-xl transition duration-300">
                  <i className="fas fa-tags mr-2 text-white fa-lg"></i>
                  <p className="text-white font-bold text-sm uppercase">Store</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Learn More Section */}
        <div className="flex flex-col text-center space-y-6 animate-fade-up animate-once animate-duration-[1500ms] animate-delay-[1700ms]">
          <p className="font-bold text-white/60">Learn More</p>
          <div className="animate-bounce animate-infinite">
            <i className="fas fa-arrow-down fa-2xl text-white/60"></i>
          </div>
        </div>

        {/* What Do We Do Section */}
        <div className="mb-10">
          <div className="flex md:flex-row flex-col justify-between space-x-20">
            <div className="text-start md:w-full">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 bg-clip-text text-transparent">
                What do we do and why?
              </p>
              <p className="text-white/60 font-bold mt-2">
                We offer a wide range of features to help you connect with others, and share your online presence.
                Using our endless customizability you can really tweak everything the way you like it.
                This projected started as an idea abandoned months ago, but revived to be used as school project.
              </p>
            </div>
            <div className="relative w-full">
              <img src="/static/assets/square.png" className="select-none absolute top-[-28%] z-0" />
              <div
                className="relative z-10 border border-white/60 border-4 rounded-lg"
                ref={(el) => {
                  if (el) {
                    VanillaTilt.init(el, {
                      max: 5,
                      speed: 400,
                      glare: false,
                      "max-glare": 0.5,
                      reverse: false,
                    });
                  }
                }}
              >
                <img src="/static/assets/whatdowedo.png" className="select-none rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Level Up Your Profile Section */}
        <div className="mt-20 w-full relative flex flex-col items-center">
          <p className="text-5xl font-extrabold bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 bg-clip-text text-transparent">
            Level up your profile
          </p>
          <p className="text-white/60 font-bold mt-2 text-center">
            With our wide range of customizability, you can truly stand out and make your profile your own.
          </p>

          {/* Background Beams */}
          <div className="absolute inset-0 mt-10 flex items-center justify-center z-0">
            <div className="absolute w-[700px] h-[500px] bg-gradient-to-r from-indigo-800 to-purple-800 rounded-full opacity-30 blur-3xl transform rotate-45 -translate-x-40"></div>
            <div className="absolute w-[800px] h-[600px] bg-gradient-to-r from-purple-800 to-pink-800 rounded-full opacity-30 blur-3xl transform rotate-12 translate-x-40"></div>
          </div>

          {/* Image Cards */}
          <div className="relative flex flex-row justify-center mt-5 space-x-12 z-10">
            {/* Card 1 */}
            {[
              { src: '/static/assets/activity.png', label: 'Discord Activity' },
              { src: '/static/assets/bgvid.gif', label: 'Video Background' },
              { src: '/static/assets/song.png', label: 'Play Music' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col w-1/3 group">
                <div className="border border-4 border-white/60 rounded-lg relative overflow-hidden">
                  <SpotlightEffect>
                    <img
                      className="select-none transition-transform transform scale-100 group-hover:scale-110 rounded brightness-[60%] blur-[2px] group-hover:blur-0 group-hover:brightness-100 transition duration-300"
                      src={item.src}
                      alt={item.label}
                    />
                    <p className="select-none absolute inset-0 flex mt-4 justify-center font-bold text-lg text-white/80 transition-opacity duration-300 group-hover:opacity-100">
                      {item.label}
                    </p>
                  </SpotlightEffect>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Slider Section */}
        <div className="w-full mt-20 overflow-hidden relative flex flex-col items-center">
          <p className="text-5xl font-extrabold bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 bg-clip-text text-transparent">
            Wondering what we got in store?
          </p>
          <p className="text-white/60 font-bold mt-2 text-center">
            Take a look at a few of the featured profiles below to get an idea of what is possible.
          </p>

          {/* Slider Container */}
          <div className="flex flex-col mt-4 w-full justify-center overflow-hidden space-y-4">
            {/* Left to right slider */}
            <div className="container flex relative overflow-hidden whitespace-nowrap [mask-image:_linear-gradient(to_right,_transparent_0,_white_128px,white_calc(100%-128px),_transparent_100%)]">
              <div className="flex animate-slide-left-infinite space-x-4 mr-4 inline-block w-max py-1">
              {users.map((user) => (
                <a href={user.profileLink} key={user.profileLink}>
                  <div className="hover:cursor-pointer hover:border-white hover:translate-y-[-0.25rem] transition duration-300 bg-white/20 border border-4 rounded-lg border-white/60 px-4 py-2 font-bold w-fit overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <img src={user.imgSrc} className="select-none w-[40px] h-[40px] rounded-full max-w-[50px] max-h-[50px] object-cover select-none" alt={user.username} />
                      <p className="font-bold truncate">{user.username}</p>
                    </div>
                  </div>
                </a>
              ))}
              </div>
              {/* Duplicate for infinite effect */}
              <div className="flex animate-slide-left-infinite space-x-4 inline-block w-max py-1">
              {users.map((user) => (
                <a href={user.profileLink} key={user.profileLink}>
                  <div className="hover:cursor-pointer hover:border-white hover:translate-y-[-0.25rem] transition duration-300 bg-white/20 border border-4 rounded-lg border-white/60 px-4 py-2 font-bold w-fit overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <img src={user.imgSrc} className="select-none w-[40px] h-[40px] rounded-full max-w-[50px] max-h-[50px] object-cover select-none" alt={user.username} />
                      <p className="font-bold truncate">{user.username}</p>
                    </div>
                  </div>
                </a>
              ))}
              </div>
            </div>

            {/* Right to left slider */}
            <div className="container flex relative overflow-hidden whitespace-nowrap [mask-image:_linear-gradient(to_right,_transparent_0,_white_128px,white_calc(100%-128px),_transparent_100%)]">
              <div className="flex animate-slide-right-infinite space-x-4 mr-4 inline-block w-max py-1">
                {users.map((user, index) => (
                  <a href={user.profileLink}>
                    <div key={index} className="hover:cursor-pointer hover:border-white hover:translate-y-[-0.25rem] transition duration-300 bg-white/20 border border-4 rounded-lg border-white/60 px-4 py-2 font-bold w-fit overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <img src={user.imgSrc} className="select-none w-[40px] h-[40px] rounded-full max-w-[50px] max-h-[50px] object-cover" alt={user.username} />
                        <p className="font-bold truncate">{user.username}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {/* Duplicate for infinite effect */}
              <div className="flex animate-slide-right-infinite space-x-4 inline-block w-max py-1">
                {users.map((user, index) => (
                  <a href={user.profileLink}>
                    <div key={index} className="hover:cursor-pointer hover:border-white hover:translate-y-[-0.25rem] transition duration-300 bg-white/20 border border-4 rounded-lg border-white/60 px-4 py-2 font-bold w-fit overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <img src={user.imgSrc} className="select-none w-[40px] h-[40px] rounded-full max-w-[50px] max-h-[50px] object-cover" alt={user.username} />
                        <p className="font-bold truncate">{user.username}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}