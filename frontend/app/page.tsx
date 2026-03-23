'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import PredictionResult from '@/components/PredictionResult';
import Disclaimer from '@/components/Disclaimer';
import { predictImage, PredictionResponse } from '@/lib/api';

// Allowed file types [1]
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE_MB = 10;

export default function Home() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  // Validate file before sending to backend [1]
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type (${file.type}). 
              Please upload a JPG or PNG file.`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return `File too large (${fileSizeMB.toFixed(1)}MB). 
              Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`;
    }

    // Check file is not empty
    if (file.size === 0) {
      return 'File is empty. Please upload a valid image.';
    }

    return null; // No errors
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    // Run all validations before API call [1]
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictImage(selectedFile);
      setResult(prediction);
    } catch (err: any) {
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);
      console.error('Status:', err.response?.status);

      // Handle specific HTTP error codes from backend [1]
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 400) {
        setError(`Invalid file: ${detail}`);
      } else if (status === 413) {
        setError('File too large. Maximum allowed size is 10MB.');
      } else if (status === 415) {
        setError('Unsupported file type. Please upload JPG or PNG only.');
      } else if (status === 422) {
        setError('Could not process image. Please try a different file.');
      } else if (status === 500) {
        setError('Server error. Please try again later.');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your network.');
      } else {
        setError(
          detail ||
          err.message ||
          'Failed to analyze image. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  // Calculate file size for display
  const fileSizeMB = selectedFile
    ? selectedFile.size / (1024 * 1024)
    : 0;
  const isFileTooLarge = fileSizeMB > MAX_FILE_SIZE_MB;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🧠 Brain Tumor Classifier
            </h1>
            <p className="text-sm text-gray-500">
              AI-powered CT scan analysis prototype
            </p>
          </div>
          <a
            href="/history"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View History →
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Disclaimer - Required [1] */}
        <Disclaimer />

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Upload CT Scan Image
          </h2>

          {/* Image Uploader */}
          <ImageUploader
            onUpload={handleFileSelected}
            isLoading={isLoading}
          />

          {/* File Info - shown when file selected */}
          {selectedFile && !isLoading && (
            <div className="mt-3 text-sm text-center space-y-1">
              <div>
                <span className={`font-medium ${
                  isFileTooLarge ? 'text-red-500' : 'text-gray-600'
                }`}>
                  📄 {selectedFile.name}
                </span>
              </div>
              <div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isFileTooLarge
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {fileSizeMB.toFixed(2)} MB
                  {isFileTooLarge ? ' ⚠ Too large!' : ' ✓ Size OK'}
                </span>
                <span className="text-gray-400 text-xs ml-2">
                  (max {MAX_FILE_SIZE_MB}MB)
                </span>
              </div>
              <div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  ALLOWED_TYPES.includes(selectedFile.type)
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {selectedFile.type || 'unknown type'}
                  {ALLOWED_TYPES.includes(selectedFile.type)
                    ? ' ✓ Type OK'
                    : ' ⚠ Invalid type!'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && !isLoading && (
            <div className="mt-4 flex gap-3">

              {/* Analyze Button - disabled if file invalid */}
              <button
                onClick={handleAnalyze}
                disabled={isFileTooLarge || !ALLOWED_TYPES.includes(selectedFile.type)}
                className={`flex-1 font-semibold py-3 px-6 rounded-lg
                            transition-colors duration-200
                            flex items-center justify-center gap-2
                            ${isFileTooLarge || !ALLOWED_TYPES.includes(selectedFile.type)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
              >
                {isFileTooLarge || !ALLOWED_TYPES.includes(selectedFile.type)
                  ? '⚠ Invalid File'
                  : '🔍 Analyze CT Scan'
                }
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200
                           text-gray-700 font-medium py-3 px-4
                           rounded-lg transition-colors duration-200"
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"/>
              <p className="text-gray-600 mt-3 font-medium">
                Analyzing CT scan...
              </p>
              <p className="text-gray-400 text-sm mt-1">
                This may take a few seconds
              </p>
            </div>
          )}
        </div>

        {/* Error Display [1] */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            <p className="text-red-500 text-xs mt-1">
              Please check your image file and try again.
            </p>
          </div>
        )}

        {/* Results [1] */}
        {result && <PredictionResult result={result} />}

      </div>
    </main>
  );
}
