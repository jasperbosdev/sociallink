// export default function Footer() {
//     return (
//         <>
//             <div className="flex justify-center py-4 font-bold text-white/80">
//                 <p className="bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 bg-clip-text text-transparent">
//                     @leeuwz <span className="text-white">🐈</span> &copy; 2024
//                 </p>
//             </div>
//         </>
//     );
// }

export default function Footer() {
    return (
        <>
            <div id="footer">
                <div className="px-8 max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between border-b-4 border-white/60">
                    {/* logo with socials */}
                    <div className="flex flex-col">
                        <div className="flex justify-center md:justify-start">
                            <img src="/static/logo.png" className="w-32 h-auto"></img>
                        </div>
                        <div className="flex flex-row space-x-2 mt-3 justify-center md:justify-start">
                        <a href="#/" className="hover:translate-y-[-5px] transition duration-150 hover:text-white/60"><i className="fab fa-x-twitter fa-lg"></i></a>
                        <a href="https://github.com/leeuwz" target="_blank" className="hover:translate-y-[-5px] transition duration-150 hover:text-white/60"><i className="fab fa-github fa-lg"></i></a>
                        <a href="#/" className="hover:translate-y-[-5px] transition duration-150 hover:text-white/60"><i className="fab fa-discord fa-lg"></i></a>
                        </div>
                    </div>
                    {/* help/info section */}
                    <div className="py-4 md:py-0 flex flex-row space-x-8 md:space-x-12 justify-center md:justify-start text-center md:text-start">
                        <div className="flex flex-col">
                            <p className="font-bold text-white/60 border-b-4 border-white/60">Contact</p>
                            <p className="font-bold text-white/60 mt-2">Abuse</p>
                            <p className="font-bold text-white/60">Privacy</p>
                            <p className="font-bold text-white/60 mb-3">Support</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-bold text-white/60 border-b-4 border-white/60">Contact</p>
                            <a href="/faq"><p className="font-bold text-white/60 mt-2">FAQ</p></a>
                            <a href="/tos"><p className="font-bold text-white/60">Terms of Service</p></a>
                            <a href="/privacy"><p className="font-bold text-white/60 mb-3">Privacy Policy</p></a>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center py-4 font-bold text-white/80">
                    <p className="bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 bg-clip-text text-transparent">
                        @leeuwz <span className="text-white">🐈</span> &copy; 2024
                    </p>
                </div>
            </div>
        </>
    );
}