export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <div className="ml-3">
          <p className="text-sm font-bold text-yellow-800">
            ⚠️ Important Medical Disclaimer
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            This tool is a <strong>research prototype only</strong> and is{' '}
            <strong>NOT a medical device</strong>. Results should{' '}
            <strong>never</strong> be used as a clinical diagnosis or to guide
            medical decisions. Always consult a qualified healthcare
            professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
