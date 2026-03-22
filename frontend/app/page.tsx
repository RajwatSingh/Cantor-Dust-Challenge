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

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const prediction = await predictImage(file);
      setResult(prediction);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Failed to analyze image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
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
          <ImageUploader onUpload={handleUpload} isLoading={isLoading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">❌ {error}</p>
          </div>
        )}

        {/* Results - Required [1] */}
        {result && <PredictionResult result={result} />}
      </div>
    </main>
  );
}
