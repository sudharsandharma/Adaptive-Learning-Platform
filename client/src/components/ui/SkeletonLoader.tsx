import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};
