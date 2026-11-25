import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { isUsableNewsImage } from '@/lib/news-images';

type NewsArticleImageProps = {
  src?: string | null;
  alt: string;
  className: string;
};

const NewsArticleImage: React.FC<NewsArticleImageProps> = ({ src, alt, className }) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = isUsableNewsImage(src) && failedSrc !== src;

  return (
    <div className={className}>
      {showImage ? (
        <img src={src} alt={alt} onError={() => setFailedSrc(src || null)} className="h-full w-full object-cover" />
      ) : (
        <div role="img" aria-label={`Visuel indisponible : ${alt}`} className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-800 text-gray-500">
          <ImageOff aria-hidden="true" className="h-7 w-7" />
          <span className="text-xs">Visuel indisponible</span>
        </div>
      )}
    </div>
  );
};

export default NewsArticleImage;
