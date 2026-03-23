'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import PredictionResult from '@/components/PredictionResult';
import Disclaimer from '@/components/Disclaimer';
import { predictImage, PredictionResponse } from '@/lib/api';

export default function Home() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // NEW

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setResult(null);      // Clear previous results
    setError(null);       // Clear previous errors
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
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
      
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to analyze image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

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
          
          {/* Image Uploader - now just selects file */}
          <ImageUploader
            onUpload={handleFileSelected}
            isLoading={isLoading}
          />

          {/* Action Buttons - shown after file selected */}
          {selectedFile && !isLoading && (
            <div className="mt-6 flex gap-3">
              
              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                className="flex-1 bg-blue-600 hover:bg-blue-700 
                           text-white font-semibold py-3 px-6 
                           rounded-lg transition-colors duration-200
                           flex items-center justify-center gap-2"
              >
                🔍 Analyze CT Scan
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
              <div className="inline-block animate-spin rounded-full h-10 w-10 
                              border-4 border-blue-500 border-t-transparent"/>
              <p className="text-gray-600 mt-3 font-medium">
                Analyzing CT scan...
              </p>
              <p className="text-gray-400 text-sm mt-1">
                This may take a few seconds
              </p>
            </div>
          )}

          {/* File Info - shown when file selected */}
          {selectedFile && !isLoading && (
            <div className="mt-3 text-sm text-gray-500 text-center">
              Selected: <span className="font-medium">{selectedFile.name}</span>
              {' '}({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            <p className="text-red-500 text-xs mt-1">
              Please check your image file and try again.
            </p>
          </div>
        )}

	{/* Results - pass filename for save feature */}
	{/* Results [1] */}
	{result && <PredictionResult result={result} />}
      </div>
    </main>
  );
}
