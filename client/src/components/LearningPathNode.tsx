import React from 'react';
import { Card } from './ui/Card';
import { LearningPathNode as NodeData } from '../types';
import { CheckCircle, Circle, Lock, PlayCircle } from 'lucide-react';

interface LearningPathNodeProps {
  node: NodeData;
  isLast?: boolean;
  onClick?: () => void;
}

export const LearningPathNode: React.FC<LearningPathNodeProps> = ({ node, isLast, onClick }) => {
  const getStatusIcon = () => {
    switch (node.status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-accent-500" />;
      case 'current': return <PlayCircle className="w-6 h-6 text-primary-500" />;
      case 'locked': return <Lock className="w-6 h-6 text-gray-300" />;
      default: return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  const getBorderClass = () => {
    if (node.status === 'completed') return 'border-accent-200';
    if (node.status === 'current') return 'border-primary-500 ring-2 ring-primary-100';
    return 'border-gray-100 opacity-75';
  };

  return (
    <div className="relative flex">
      {!isLast && (
        <div className="absolute left-8 top-16 bottom-0 w-0.5 -ml-px bg-gray-200" />
      )}
      
      <div className="flex-shrink-0 w-16 flex justify-center pt-6 z-10 bg-white">
        {getStatusIcon()}
      </div>
      
      <div className="flex-grow pb-8 pl-4 pr-2">
        <Card 
          hoverable={node.status !== 'locked'} 
          className={`${getBorderClass()} transition-all`}
          onClick={node.status !== 'locked' ? onClick : undefined}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold text-lg ${node.status === 'locked' ? 'text-gray-500' : 'text-gray-900'}`}>
              {node.topicName}
            </h3>
            {node.score !== undefined && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-accent-50 text-accent-700 text-xs font-medium">
                {node.score}% Score
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="capitalize text-xs font-medium bg-gray-100 px-2 py-1 rounded-md">{node.difficulty}</span>
            <span>~{node.estimatedTime}</span>
          </div>
          {node.reason && (
            <p className="mt-3 text-sm text-primary-600 bg-primary-50 p-2 rounded-lg italic">
              {node.reason}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};
