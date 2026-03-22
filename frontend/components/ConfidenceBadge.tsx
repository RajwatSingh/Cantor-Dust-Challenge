interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low';
  requires_human_review: boolean;
}

export default function ConfidenceBadge({ 
  confidence, 
  requires_human_review 
}: ConfidenceBadgeProps) {
  
  const styles = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-red-100 text-red-800 border-red-300'
  };
  
  const labels = {
    high: '✓ High Confidence',
    medium: '~ Medium Confidence',
    low: '⚠ Low Confidence'
  };
  
  const descriptions = {
    high: 'Model is highly confident in this prediction',
    medium: 'Model has moderate confidence - interpret carefully',
    low: 'Model has low confidence - human review recommended'
  };

  return (
    <div className="space-y-2">
      {/* Confidence Badge */}
      <span className={`inline-flex items-center px-3 py-1 rounded-full 
                        text-sm font-medium border ${styles[confidence]}`}>
        {labels[confidence]}
      </span>
      
      {/* Description */}
      <p className="text-sm text-gray-600">
        {descriptions[confidence]}
      </p>
      
      {/* Human Review Flag [1] */}
      {requires_human_review && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
          <p className="text-red-700 text-sm font-medium">
            🔍 Human Review Required
          </p>
          <p className="text-red-600 text-xs mt-1">
            This prediction has low confidence and should be 
            reviewed by a medical professional before any action is taken.
          </p>
        </div>
      )}
    </div>
  );
}
