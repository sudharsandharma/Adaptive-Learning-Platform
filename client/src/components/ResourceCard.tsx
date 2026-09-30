import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Resource } from '../types';
import { Video, FileText, MousePointer2, CheckCircle, FileOutput, ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getTypeIcon = () => {
    switch (resource.type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'interactive': return <MousePointer2 className="w-5 h-5" />;
      case 'practice': return <CheckCircle className="w-5 h-5" />;
      case 'pdf': return <FileOutput className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <Card hoverable className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
          {getTypeIcon()}
        </div>
        <Badge variant="default">{resource.difficulty}</Badge>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 leading-tight">{resource.title}</h3>
      <p className="text-xs text-primary-600 mb-3">{resource.topicName}</p>
      <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{resource.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500">{resource.estimatedMinutes} min</span>
        <Button variant="secondary" size="sm" onClick={() => window.open(resource.url, '_blank')} icon={<ExternalLink className="w-3 h-3" />}>
          Open
        </Button>
      </div>
    </Card>
  );
};
