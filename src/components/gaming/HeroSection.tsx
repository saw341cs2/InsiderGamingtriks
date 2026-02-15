import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  bannerUrl: string;
}

const HeroSection = ({ bannerUrl }: HeroSectionProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    console.log('HeroSection - bannerUrl:', bannerUrl);
  }, [bannerUrl]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gray-900">
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900" />
      
      {/* Banner image with improved quality settings */}
      <img 
        src={bannerUrl} 
        alt="Insider Gaming Tricks - Bannière" 
        className="absolute inset-0 w-full h-full object-cover"
        onLoad={() => {
          setImgLoading(false);
          console.log('Image loaded successfully');
        }}
        onError={(e) => {
          setImgLoading(false);
          setImgError(true);
          console.log('Image error:', e);
        }}
        loading="eager"
        decoding="async"
      />
      
      {/* Gradient overlay for better text readability and image blending */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-gray-950/60 via-transparent to-gray-950/30" />
    </div>
  );
};

export default HeroSection;