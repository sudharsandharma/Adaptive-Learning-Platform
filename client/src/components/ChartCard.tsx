import React from 'react';
import { Card } from './ui/Card';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, description, children, className = '' }) => {
  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex-grow w-full">
        {children}
      </div>
    </Card>
  );
};
