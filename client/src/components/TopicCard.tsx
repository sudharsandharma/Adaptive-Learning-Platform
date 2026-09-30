import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { Button } from './ui/Button';
import { Topic, Progress } from '../types';
import { PlayCircle } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  progress?: Progress;
  onStart?: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, progress, onStart }) => {
  const difficultyColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  } as const;

  const masteryScore = progress?.masteryScore || 0;

  return (
    <Card hoverable className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-medium text-primary-600 mb-1 block uppercase tracking-wider">{topic.subject}</span>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{topic.name}</h3>
        </div>
        <Badge variant={difficultyColors[topic.difficulty]}>
          {topic.difficulty}
        </Badge>
      </div>
      <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-2">{topic.description}</p>
      
      <div className="mt-auto space-y-4">
        <div>
          <ProgressBar progress={masteryScore} label="Mastery" color={masteryScore >= 80 ? 'bg-accent-500' : 'bg-primary-500'} />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500 font-medium">~{topic.estimatedHours}h estimated</span>
          {onStart && (
            <Button size="sm" onClick={onStart} icon={<PlayCircle className="w-4 h-4" />}>
              {masteryScore > 0 ? 'Continue' : 'Start'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
