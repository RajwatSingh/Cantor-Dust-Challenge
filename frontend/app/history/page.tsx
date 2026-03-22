'use client';

import { useEffect, useState } from 'react';
import { getHistory, HistoryRecord } from '@/lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Inference History
          </h1>
          <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Upload
          </a>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No predictions yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['File', 'Prediction', 'Probability', 
                    'Confidence', 'Review Needed', 
                    'Model', 'Timestamp'].map(header => (
                    <th key={header}
                        className="px-4 py-3 text-left text-xs 
                                   font-medium text-gray-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {record.filename}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.predicted_label === 'tumor'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {record.predicted_label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(record.tumor_probability * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.confidence === 'high' 
                          ? 'bg-green-100 text-green-700'
                          : record.confidence === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {record.confidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {record.requires_human_review ? '🔍 Yes' : '✓ No'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {record.model_version}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
