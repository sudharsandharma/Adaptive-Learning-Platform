import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendLabel, className }) => {
  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 font-medium text-sm">{title}</span>
        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${trend >= 0 ? 'text-accent-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{Math.abs(trend)}% {trendLabel && <span className="text-gray-400 ml-1">{trendLabel}</span>}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
