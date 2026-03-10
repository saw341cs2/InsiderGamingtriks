import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full h-[700px] bg-gray-950 flex items-center justify-center">
      <h1 className="text-6xl md:text-8xl font-black text-white tracking-wider">
        <span className="text-red-500">#</span>FPS Gaming
      </h1>
    </div>
  );
};

export default HeroSection;