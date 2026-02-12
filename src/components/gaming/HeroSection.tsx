import React from 'react';

interface HeroSectionProps {
  bannerUrl: string;
  onScrollToProducts: () => void;
}

const HeroSection = ({ bannerUrl, onScrollToProducts }: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gray-900">
      <img 
        src={bannerUrl} 
        alt="Banner" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <button 
          onClick={onScrollToProducts}
          className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors"
        >
          VOIR LES TRICKS
        </button>
      </div>
    </div>
  );
};

export default HeroSection;