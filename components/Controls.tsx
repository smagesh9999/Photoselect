import React from 'react';
import ExportIcon from './icons/ExportIcon';
import ExportFilesIcon from './icons/ExportFilesIcon';

interface ControlsProps {
  currentIndex: number;
  totalPhotos: number;
  selectedCount: number;
  onExport: () => void;
  onExportFiles: () => void;
  isExporting: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  currentIndex, 
  totalPhotos, 
  selectedCount,
  onExport,
  onExportFiles,
  isExporting
}) => {
  return (
    <header className="bg-gray-800 shadow-md p-3 flex justify-between items-center w-full z-10">
      <h1 className="text-xl font-bold text-white">Photo Culling Assistant</h1>
      
      <div className="flex items-center space-x-6 text-sm">
        {totalPhotos > 0 && (
          <>
            <span className="font-mono bg-gray-700 px-3 py-1 rounded">
              {currentIndex + 1} / {totalPhotos}
            </span>
            <span className="font-mono bg-green-800/50 text-green-300 px-3 py-1 rounded">
              Selected: {selectedCount}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onExportFiles}
          disabled={selectedCount === 0 || isExporting}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <ExportFilesIcon className="w-5 h-5" />
          <span>{isExporting ? 'Exporting...' : 'Export Files'}</span>
        </button>
        <button
          onClick={onExport}
          disabled={selectedCount === 0}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <ExportIcon className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>
    </header>
  );
};

export default Controls;