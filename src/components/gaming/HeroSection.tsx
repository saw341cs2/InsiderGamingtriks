import React from 'react';

interface HeroSectionProps {
  bannerUrl?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ bannerUrl }) => {
  return (
    <div className="relative w-full h-[700px] overflow-hidden bg-gray-900">
      {/* Background - only show if bannerUrl is provided */}
      {bannerUrl && (
        <div className="absolute inset-0">
          <img
            src={bannerUrl}
            alt="Insider Gaming Tricks - Bannière"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {/* Title overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-wider">
          <span className="text-red-500">#</span>Insider Gaming Tricks
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;