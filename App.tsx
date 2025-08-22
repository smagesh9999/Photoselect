import React, { useState, useEffect, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { Photo } from './types';
import Controls from './components/Controls';
import ImagePreview from './components/ImagePreview';
import Filmstrip from './components/Filmstrip';
import UploadIcon from './components/icons/UploadIcon';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPhotos = photos.filter(p => p.selected);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Clean up old object URLs before creating new ones
      photos.forEach(photo => URL.revokeObjectURL(photo.url));
      
      const newPhotos: Photo[] = Array.from(files)
        .filter((file: File) => file.type.startsWith('image/'))
        .map((file: File, index): Photo => ({
          id: `${file.name}-${file.lastModified}-${index}`,
          file,
          url: URL.createObjectURL(file),
          name: file.name.substring(0, file.name.lastIndexOf('.')),
          selected: false,
        }));
      setPhotos(newPhotos);
      setCurrentIndex(newPhotos.length > 0 ? 0 : -1);
    }
  };

  const toggleSelect = useCallback(() => {
    if (currentIndex === -1) return;
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos];
      const photo = newPhotos[currentIndex];
      if (photo) {
        photo.selected = !photo.selected;
      }
      return newPhotos;
    });
  }, [currentIndex]);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (photos.length === 0) return;
    if (direction === 'next') {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    } else {
      setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
    }
  }, [photos.length]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'ArrowRight') {
      navigate('next');
    } else if (event.code === 'ArrowLeft') {
      navigate('prev');
    } else if (event.code === 'Space') {
      event.preventDefault();
      toggleSelect();
    }
  }, [navigate, toggleSelect]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.url));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = () => {
    if (selectedPhotos.length === 0) {
      alert('No photos selected to export.');
      return;
    }
    const csvContent = "data:text/csv;charset=utf-8," + selectedPhotos.map(p => p.name).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_photos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFiles = async () => {
    if (selectedPhotos.length === 0) {
      alert('No photos selected to export.');
      return;
    }

    setIsExporting(true);
    try {
      const zip = new JSZip();
      selectedPhotos.forEach(photo => {
        zip.file(photo.file.name, photo.file);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'selected_photos.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('An error occurred while creating the zip file.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      <Controls
        currentIndex={currentIndex}
        totalPhotos={photos.length}
        selectedCount={selectedPhotos.length}
        onExport={handleExport}
        onExportFiles={handleExportFiles}
        isExporting={isExporting}
      />
      <main className="flex-1 min-h-0 flex items-center justify-center p-4 relative">
        {photos.length > 0 && currentIndex !== -1 ? (
          <ImagePreview photo={photos[currentIndex]} />
        ) : (
          <div className="text-center">
            <button
              onClick={handleUploadClick}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg flex flex-col items-center transition-colors duration-200"
            >
              <UploadIcon className="w-16 h-16 mb-4" />
              <span className="text-xl">Upload Photos</span>
            </button>
            <p className="mt-4 text-gray-400">Use arrow keys to navigate and spacebar to select.</p>
          </div>
        )}
      </main>
      <Filmstrip photos={selectedPhotos} />
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default App;