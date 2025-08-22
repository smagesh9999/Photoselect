
import React from 'react';
import { Photo } from '../types';

interface FilmstripProps {
  photos: Photo[];
}

const Filmstrip: React.FC<FilmstripProps> = ({ photos }) => {
  if (photos.length === 0) {
    return (
        <div className="h-28 bg-gray-800/50 flex items-center justify-center text-gray-400">
            Selected photos will appear here.
        </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm shadow-inner p-2 h-28">
      <div className="flex space-x-3 overflow-x-auto h-full items-center pb-2">
        {photos.map(photo => (
          <div key={photo.id} className="flex-shrink-0 h-20 w-28">
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-cover rounded-md shadow-lg border-2 border-gray-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filmstrip;
