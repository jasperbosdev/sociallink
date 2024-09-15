// beams experiment
export default function Home() {
    return (
        <div className="relative h-screen bg-gradient-to-r from-purple-900 to-gray-900 overflow-hidden flex items-center justify-center">
            {/* Background Stars */}

            {/* Stacked Background Beams */}
            <div className="bg-black absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-indigo-800 to-purple-800 rounded-full opacity-30 blur-3xl transform rotate-45 -translate-x-40"></div>
                <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-800 to-pink-800 rounded-full opacity-30 blur-3xl transform rotate-12 translate-x-40"></div>
                <div className="flex items-center space-x-12">
                    {/* <p>card</p>
                    <p>card</p>
                    <p>card</p> */}
                </div>
            </div>

            <button>
              <span className="spark__container">
                <span className="spark" />
                <span className="spark1" />
              </span>
              <span className="backdrop" />
              <span className="text">Shooting star border</span>
            </button>


        </div>
    );
}
