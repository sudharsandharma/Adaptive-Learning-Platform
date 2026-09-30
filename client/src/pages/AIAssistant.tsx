import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { AIMessage } from '../types';
import { AIChat } from '../components/AIChat';
import { Card } from '../components/ui/Card';
import { Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: 'assistant', content: `Hi ${user?.name.split(' ')[0]}! I'm your NOMAD learning assistant. How can I help you today?` }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "What should I study next based on my path?",
    "Can you explain Calculus limits simply?",
    "Give me 3 practice questions on Algebra.",
    "Why am I struggling with my recent assessments?",
  ];

  const handleSendMessage = async (content: string) => {
    const userMsg: AIMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiService.sendMessage(content, { userId: user?._id });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      console.error('AI chat failed', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in">
      <div className="flex-grow flex flex-col h-full">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-500 mt-1">Get personalized help, explanations, and guidance.</p>
        </div>
        <div className="flex-grow bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
          <AIChat 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={loading} 
          />
        </div>
      </div>

      <div className="w-full md:w-80 flex-shrink-0 space-y-6">
        <Card className="bg-primary-50 border-primary-100">
          <div className="flex items-center space-x-2 mb-4 text-primary-700">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold">Suggested Prompts</h3>
          </div>
          <div className="space-y-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="w-full text-left p-3 text-sm text-gray-700 bg-white rounded-xl border border-primary-100 hover:border-primary-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
