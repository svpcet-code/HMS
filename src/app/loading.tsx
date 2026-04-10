import { HeartPulse } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-[100] animate-in fade-in duration-500">
      {/* Animated Medical Logo */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75 blur-md" style={{ animationDuration: '2s' }}></div>
        <div className="relative h-24 w-24 bg-white shadow-xl rounded-full flex items-center justify-center border border-blue-50">
          <HeartPulse className="h-12 w-12 text-blue-600 animate-pulse" />
        </div>
      </div>
      
      {/* Loading Quotes */}
      <div className="max-w-md text-center px-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Loading HMS...</h2>
        <p className="text-sm italic text-gray-600 mt-4 leading-relaxed">
          &quot;The good physician treats the disease; the great physician treats the patient who has the disease.&quot;
        </p>
        <p className="text-xs text-gray-400 mt-2">— William Osler</p>
      </div>

      {/* Progress Bar */}
      <div className="mt-10 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 bg-blue-600 rounded-full w-1/2 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDuration: '1s' }}></div>
      </div>
    </div>
  );
}
