'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onUpload, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Clear previous errors
    setFileError(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Send file to parent
    onUpload(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,  // 10MB [1]
    disabled: isLoading,

    // Handle rejected files [1]
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((rejected) => {
        rejected.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            setFileError(
              `File is too large (${(rejected.file.size / (1024 * 1024)).toFixed(1)}MB). 
               Maximum allowed size is 10MB.`
            );
          } else if (error.code === 'file-invalid-type') {
            setFileError(
              'Invalid file type. Only JPG and PNG files are accepted.'
            );
          } else if (error.code === 'too-many-files') {
            setFileError('Please upload one file at a time.');
          } else {
            setFileError('File rejected. Please try a different file.');
          }
        });
      });
    }
  });

  return (
    <div>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center
                    transition-colors duration-200
                    ${isLoading
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : isDragActive
                      ? 'border-blue-400 bg-blue-50 cursor-pointer'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50 cursor-pointer'
                    }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div>
            <img
              src={preview}
              alt="Uploaded CT scan"
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
            {!isLoading && (
              <p className="text-gray-400 text-xs mt-3">
                Click or drag to replace image
              </p>
            )}
          </div>
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
            <p className="text-gray-400 text-xs mt-2">
              Accepted: JPG, PNG • Max size: 10MB
            </p>
          </div>
        )}
      </div>

      {/* File Validation Error from Dropzone */}
      {fileError && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm font-medium">❌ {fileError}</p>
        </div>
      )}
    </div>
  );
}
