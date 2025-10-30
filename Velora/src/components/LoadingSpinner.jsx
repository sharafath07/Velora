import React from 'react';
import '../styles/loading-spinner.css'; // You can create this for styling if needed

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-10 h-10 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
