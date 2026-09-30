import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, onClick }) => {
  const baseClasses = 'bg-white rounded-2xl border border-gray-100 p-6';
  const shadowClasses = hoverable ? 'shadow-card hover:shadow-card-hover transition-shadow duration-200 cursor-pointer' : 'shadow-card';
  
  return (
    <div className={`${baseClasses} ${shadowClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
