import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size, 
  strokeWidth 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Determine color based on progress
  let progressColor = '';
  if (progress < 30) {
    progressColor = '#ef4444'; // error-500
  } else if (progress < 70) {
    progressColor = '#f59e0b'; // warning-500
  } else {
    progressColor = '#22c55e'; // success-500
  }
  
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-800 dark:text-white">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;