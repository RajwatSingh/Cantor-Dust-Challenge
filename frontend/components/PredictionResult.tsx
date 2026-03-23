import ConfidenceBadge from './ConfidenceBadge';
import { PredictionResponse } from '@/lib/api';

interface PredictionResultProps {
  result: PredictionResponse;
}

export default function PredictionResult({ result }: PredictionResultProps) {
  const isTumor = result.predicted_label === 'tumor';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Analysis Results
      </h2>

      {/* Main Prediction */}
      <div className={`rounded-lg p-4 mb-4 ${
        isTumor
          ? 'bg-red-50 border border-red-200'
          : 'bg-green-50 border border-green-200'
      }`}>
        <p className="text-sm text-gray-500 mb-1">Finding</p>
        <p className={`text-2xl font-bold ${
          isTumor ? 'text-red-700' : 'text-green-700'
        }`}>
          {isTumor ? 'Potential Tumor Detected' : 'No Tumor Detected'}
        </p>
      </div>

      {/* Probability Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Tumor Probability</span>
          <span className="font-medium">
            {(result.tumor_probability * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isTumor ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${result.tumor_probability * 100}%` }}
          />
        </div>
      </div>

      {/* Confidence [1] */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Confidence Level</p>
        <ConfidenceBadge
          confidence={result.confidence as 'high' | 'medium' | 'low'}
          requires_human_review={result.requires_human_review}
        />
      </div>

      {/* Metadata */}
	{/* Metadata */}
	<div className="border-t pt-4 mt-4 grid grid-cols-2 gap-3 text-sm">
	  <div>
	    <p className="text-gray-700 font-semibold">Model Version</p>
	    <p className="text-gray-900 font-medium">{result.model_version}</p>
	  </div>
	  <div>
	    <p className="text-gray-700 font-semibold">Inference Time</p>
	    <p className="text-gray-900 font-medium">{result.inference_time_ms}ms</p>
	  </div>
	</div>
    </div>
  );
}
