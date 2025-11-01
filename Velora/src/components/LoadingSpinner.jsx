import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`loading-spinner-container ${className}`}>
      <div
        className={`loading-spinner loading-spinner-${size}`}
      />
    </div>
  );
};

export default LoadingSpinner;