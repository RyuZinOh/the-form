import { useState, useEffect } from 'react';
import { FaTerminal } from 'react-icons/fa';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const loadingDuration = 3000; 
  const intervalTime = 30; 
  const incrementAmount = 100 / (loadingDuration / intervalTime); 

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(oldProgress + incrementAmount, 100);
      });
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, [incrementAmount, intervalTime]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col items-center">
        <div className="mb-8">
          <FaTerminal size={60} className="text-green-500 mb-4 animate-pulse" />
          <h1 className="text-5xl font-extrabold text-green-500">Loading...</h1>
        </div>
        <div className="relative w-full max-w-2xl bg-gray-900 rounded-full h-10 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
