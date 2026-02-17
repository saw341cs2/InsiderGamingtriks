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
    </div>
  );
};

export default HeroSection;