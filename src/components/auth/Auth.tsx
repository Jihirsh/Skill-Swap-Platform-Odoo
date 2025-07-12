import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import { ArrowLeftRight } from 'lucide-react';

export default function Auth() {
  const [swapauth, setswap] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <ArrowLeftRight size={32} strokeWidth={2} className="bg-gray-900 text-white rounded-full p-1" />
          <h2 className="text-2xl font-bold text-gray-800">SkillSwap</h2>
        </div>

        {/* Form (Login or Signup) */}
        <div>
          {swapauth ? <Login /> : <Signup />}
        </div>

        {/* Toggle Text */}
        <div className="text-center">
          {swapauth ? (
            <button
              onClick={() => setswap(false)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Don&apos;t have an account? Sign Up
            </button>
          ) : (
            <button
              onClick={() => setswap(true)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Already have an account? Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
