import Image from "next/image";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <p className="text-6xl font-bold bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 
        bg-clip-text text-transparent">Komako &gt;w&lt;</p>
      </div>
    </>
  );
}
