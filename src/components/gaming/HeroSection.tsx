import React from 'react';

interface HeroSectionProps {
  bannerUrl: string;
}

const HeroSection = ({ bannerUrl }: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gray-900">
      <img 
        src={bannerUrl} 
        alt="Banner" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default HeroSection;