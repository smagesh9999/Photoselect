
import React from 'react';
import { Photo } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface ImagePreviewProps {
  photo: Photo | undefined;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ photo }) => {
  if (!photo) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {photo.selected && (
        <div className="absolute top-4 right-4 z-10 text-green-400">
          <CheckCircleIcon className="w-12 h-12" />
        </div>
      )}
      <img
        src={photo.url}
        alt={photo.name}
        className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 ${photo.selected ? 'border-4 border-green-500' : 'border-4 border-transparent'}`}
      />
    </div>
  );
};

export default ImagePreview;
