import Image from 'next/image';
import { GoSidebarCollapse } from 'react-icons/go';
import {
  IoArrowBackOutline,
  IoArrowDownCircleOutline,
  IoArrowForwardOutline,
  IoRefreshOutline,
} from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { FaLink } from 'react-icons/fa6';
import { FaLock } from 'react-icons/fa6';

interface BrowserMockupProps {
  src: string;
  alt?: string;
}

export default function BrowserMockup({ src, alt }: BrowserMockupProps) {
  return (
    <div className="relative z-[40]">
      <div
        className="
        origin-top-left
      [transform-style:preserve-3d]
    "
        style={{
          transform:
            'matrix(0.965926, -0.258819, 0.707107, 0.707107, 58.87, 344.865)',
        }}
      >
        <div
          className="
        relative 
        w-[1114px]
        max-w-[79rem] 
        rounded-xl 
        overflow-hidden 
        drop-shadow-[-10px_10px_30px_rgba(255,255,255,0.05)]
        border 
        border-white/10
        bg-linear-to-r from-[#1a1a1a] to-black
        scale-30
        sm:scale-40
        md:scale-60
        lg:scale-80
        xl:scale-100
        origin-top-left
        
        
        

      "
        >
          <BrowserTopBar />
          {/* Screenshot */}
          <div className="relative w-full h-auto bg-black">
            <Image
              src={src}
              alt={alt || 'LeagueX dashboard mockup'}
              width={2000}
              height={1200}
              className="w-full h-auto pointer-events-none"
              priority
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-20 
                   bg-gradient-to-br from-transparent from-20%  to-black"
            aria-hidden="true"
            // good for accessibility
          />
        </div>
      </div>
    </div>
  );
}

function BrowserTopBar() {
  const colouredMacBtns = false;
  return (
    // Browser top bar
    <div className="flex items-center justify-between px-4 py-3 select-none">
      {/* Left side controls */}
      <div className="flex items-center gap-3">
        {/* macOS traffic lights */}
        <div className="flex gap-2 mr-2 ml-3">
          <span
            className={`w-3 h-3 rounded-full ${
              colouredMacBtns ? 'bg-[#ff5f57]' : 'bg-[#444444]'
            }`}
          />
          <span
            className={`w-3 h-3 rounded-full ${
              colouredMacBtns ? 'bg-[#ffbd2e]' : 'bg-[#444444]'
            }`}
          />
          <span
            className={`w-3 h-3 rounded-full ${
              colouredMacBtns ? 'bg-[#28c840]' : 'bg-[#444444]'
            }`}
          />
        </div>

        {/* Fake Mac-style buttons */}
        <GoSidebarCollapse size={16} className="text-white/70" />

        <IoArrowBackOutline size={18} className="text-white/70" />

        <IoArrowForwardOutline size={18} className="text-white/30" />

        <IoRefreshOutline size={18} className="text-white/70" />
      </div>

      {/* Center URL bar */}
      <div
        className="
        flex items-center gap-2 
        bg-white/10 
        px-4 py-1.5 
        rounded-lg 
         
        pointer-events-auto
      "
      >
        <FaLock className="text-white/50" size={10} />

        <span className="text-white/80 text-sm mx-[4rem]">leaguex.app</span>

        <FaLink size={14} className=" text-white/50" />
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-2 ml-4">
        <IoArrowDownCircleOutline className="text-white/40" size={24} />

        <MdAdd className="text-white/40" size={22} />
      </div>
    </div>
  );
}
