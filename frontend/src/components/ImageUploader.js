'use client';

import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

export default function ImageUploader({ onImageSelect, value, label = 'Upload Image' }) {
  const UPLOADCARE_PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  const handleUploadSuccess = async (e) => {
    if (!e?.successEntries || e.successEntries.length === 0) {
      console.error('Upload failed: no successful entries');
      return;
    }

    const cdnUrl = e.successEntries[0]?.cdnUrl;
    if (cdnUrl && onImageSelect) {
      onImageSelect(cdnUrl);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <FileUploaderRegular
        sourceList="local, camera"
        cameraModes="photo"
        classNameUploader="uc-light uc-turquoise"
        pubkey={UPLOADCARE_PUBLIC_KEY}
        onCommonUploadSuccess={handleUploadSuccess}
      />

      {value && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img
            src={value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
