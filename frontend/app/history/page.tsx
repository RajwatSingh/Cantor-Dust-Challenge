'use client';

import { useEffect, useState } from 'react';
import { getHistory, HistoryRecord } from '@/lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => setError('Failed to load history'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleClearHistory = async () => {
    const isConfirmed = window.confirm(
      " Are you sure you want to completely wipe the audit log? This action cannot be undone."
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch('http://localhost:8000/history', {
        method: 'DELETE',
      });

      if (response.ok) {
        setHistory([]);
      } else {
        console.error("Server refused to clear history.");
        alert("Failed to clear history. Please check the server logs.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
	<div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Inference Audit Log
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Audit log of all previous CT scan analyses
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Upload
            </a>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors duration-200 font-semibold rounded-lg text-sm"
            >
               Clear History
            </button>
          </div>
        </div>

        {/* Disclaimer [1] */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <p className="text-yellow-800 text-sm font-bold">
             Important Medical Disclaimer
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            All results shown are from a research prototype only and are
            NOT clinical diagnoses. Do not use for medical decisions.
          </p>
        </div>

        {/* Loading State */}
	{isLoading && (
	  <div className="text-center py-12">
	    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"/>
	    <p className="text-gray-600 mt-3">Loading history...</p>
	  </div>
	)}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm"> {error}</p>
            <p className="text-red-500 text-xs mt-1">
              Make sure your backend is running on port 8000
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && history.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-4xl mb-3"></p>
            <p className="text-gray-600 font-medium">No predictions yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Upload a CT scan to get started
            </p>
            <a
              href="/"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700
                         text-white font-medium py-2 px-4 rounded-lg
                         transition-colors duration-200 text-sm"
            >
              Upload Image
            </a>
          </div>
        )}

        {/* History Table [1] */}
        {!isLoading && !error && history.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            
            {/* Record Count */}
            <div className="px-6 py-3 bg-gray-50 border-b">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{history.length}</span> predictions
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'ID',
                      'File',
                      'Prediction',
                      'Probability',
                      'Confidence',
                      'Review Needed',
                      'Model Version',
                      'Timestamp'
                    ].map(header => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs
                                   font-medium text-gray-500 uppercase
                                   tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {history.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-4 py-3 text-sm text-gray-500">
                        #{record.id}
                      </td>

                      {/* Filename */}
                      <td className="px-4 py-3 text-sm text-gray-900
                                     max-w-xs truncate">
                        {record.filename}
                      </td>

                      {/* Prediction Badge */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs
                                          font-medium ${
                          record.predicted_label === 'tumor'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {record.predicted_label === 'tumor'
                            ? '🔴 Tumor'
                            : '🟢 Healthy'}
                        </span>
                      </td>

                      {/* Probability */}
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                record.predicted_label === 'tumor'
                                  ? 'bg-red-500'
                                  : 'bg-green-500'
                              }`}
                              style={{
                                width: `${record.tumor_probability * 100}%`
                              }}
                            />
                          </div>
                          <span>
                            {(record.tumor_probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Confidence Badge */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs
                                          font-medium ${
                          record.confidence === 'high'
                            ? 'bg-green-100 text-green-700'
                            : record.confidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.confidence === 'high' && '✓ High'}
                          {record.confidence === 'medium' && '~ Medium'}
                          {record.confidence === 'low' && '⚠ Low'}
                        </span>
                      </td>

                      {/* Human Review Flag [1] */}
                      <td className="px-4 py-3 text-sm">
                        {record.requires_human_review ? (
                          <span className="text-red-600 font-medium">
                            🔍 Yes
                          </span>
                        ) : (
                          <span className="text-green-600">
                            ✓ No
                          </span>
                        )}
                      </td>

                      {/* Model Version [1] */}
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.model_version}
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
