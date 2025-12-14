'use client';

import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

/**
 * ImageUploader Component
 * Handles image uploads to Uploadcare CDN using official FileUploaderRegular
 */
export default function ImageUploader({ onImageSelect, value, label = 'Upload Image' }) {
  const UPLOADCARE_PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  if (!UPLOADCARE_PUBLIC_KEY) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded">
        ⚠️ Uploadcare public key not configured. Please add NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY to your .env.local
      </div>
    );
  }

  const handleFileSelect = (fileInfo) => {
    // Handle file selection from Uploadcare uploader
    if (fileInfo.allEntries && fileInfo.allEntries.length > 0) {
      const entry = fileInfo.allEntries[0];
      if (entry.cdnUrl && onImageSelect) {
        onImageSelect(entry.cdnUrl);
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <FileUploaderRegular
        sourceList="local, camera"
        cameraModes="photo"
        classNameUploader="uc-light uc-turquoise"
        pubkey={UPLOADCARE_PUBLIC_KEY}
        onFileSelect={handleFileSelect}
      />

      {value && (
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">Preview:</div>
          <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 break-all">
            {value}
          </div>
        </div>
      )}
    </div>
  );
}
