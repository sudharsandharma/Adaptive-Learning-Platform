import React, { useState, useRef, useEffect } from 'react';
import { AIMessage } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface AIChatProps {
  messages: AIMessage[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <Card className="flex flex-col h-[600px] p-0 overflow-hidden">
      <div className="p-4 bg-primary-600 text-white flex items-center space-x-3">
        <Bot className="w-6 h-6" />
        <div>
          <h3 className="font-semibold">NOMAD Assistant</h3>
          <p className="text-xs text-primary-100">Always here to help you learn</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-surface-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-primary-100 text-primary-600 ml-3' : 'bg-white text-primary-600 border border-primary-100 mr-3'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white text-primary-600 border border-primary-100 mr-3 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 bg-surface-50"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || isLoading} className="flex-shrink-0 px-4">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
