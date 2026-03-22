'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onUpload, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    
    // Send to parent
    onUpload(file);
  }, [onUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },  // Validated [1]
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024  // 10MB max [1]
  });

  return (
    <div>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center 
                    cursor-pointer transition-colors duration-200
                    ${isDragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                    }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <img
            src={preview}
            alt="Uploaded scan"
            className="max-h-64 mx-auto rounded-lg object-contain"
          />
        ) : (
          <div>
            <p className="text-4xl mb-3">🧠</p>
            <p className="text-gray-600 font-medium">
              {isDragActive
                ? 'Drop your CT scan here...'
                : 'Drag & drop a CT scan image here'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              or click to browse files
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Supports: JPG, JPEG, PNG (max 10MB)
            </p>
          </div>
        )}
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 
                          border-4 border-blue-500 border-t-transparent"/>
          <p className="text-gray-600 mt-2">Analyzing CT scan...</p>
        </div>
      )}
    </div>
  );
}
