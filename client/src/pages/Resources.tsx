import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import { topicService } from '../services/topicService';
import { Resource, Topic } from '../types';
import { ResourceCard } from '../components/ResourceCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, BookOpen, Sparkles, Wifi } from 'lucide-react';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [recommended, setRecommended] = useState<Resource[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const topicFilter = queryParams.get('topic');

  const [filters, setFilters] = useState({
    subject: '',
    topic: topicFilter || '',
    type: '',
    bandwidth: '',
    search: '',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resTopics, resResources, resRecommended] = await Promise.allSettled([
          topicService.getTopics(),
          resourceService.getResources(),
          resourceService.getRecommendedResources(),
        ]);
        if (resTopics.status === 'fulfilled') setTopics(resTopics.value.data);
        if (resResources.status === 'fulfilled') setResources(resResources.value.data);
        if (resRecommended.status === 'fulfilled') setRecommended(resRecommended.value.data);
      } catch (error) {
        console.error('Failed to load resources', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const baseList = activeTab === 'recommended' ? recommended : resources;

  const filteredResources = baseList.filter(r => {
    if (filters.subject && r.subject !== filters.subject) return false;
    if (filters.topic && r.topic !== filters.topic) return false;
    if (filters.type && r.type !== filters.type) return false;
    if (filters.bandwidth && r.bandwidth !== filters.bandwidth) return false;
    if (
      filters.search &&
      !r.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !r.description.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
          <p className="text-gray-500 mt-1">Curated materials matched to your weak topics, learning style, and bandwidth.</p>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'recommended' ? 'bg-accent-50 text-accent-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Recommended For You ({recommended.length})</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="px-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-white text-sm"
          value={filters.topic}
          onChange={e => setFilters({ ...filters, topic: e.target.value })}
        >
          <option value="">All Topics</option>
          {topics.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <select
          className="px-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-white text-sm"
          value={filters.type}
          onChange={e => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Formats</option>
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="interactive">Interactive</option>
          <option value="practice">Practice</option>
          <option value="pdf">PDF</option>
        </select>
        <div className="relative">
          <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-white text-sm"
            value={filters.bandwidth}
            onChange={e => setFilters({ ...filters, bandwidth: e.target.value })}
          >
            <option value="">Any Bandwidth</option>
            <option value="low">Low Bandwidth Only</option>
            <option value="medium">Medium Bandwidth</option>
            <option value="high">High Bandwidth</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : filteredResources.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title="No resources found"
          description="Try adjusting your filters or search terms."
          actionLabel="Clear Filters"
          onAction={() => setFilters({ subject: '', topic: '', type: '', bandwidth: '', search: '' })}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
