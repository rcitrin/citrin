import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { streamGeminiResponse } from '../services/geminiService';
import { XIcon, SendIcon, SparklesIcon } from './Icons';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Greetings. I am Gem. How may I illuminate your path today?",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Create placeholder for model response
    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: modelMessageId,
      role: 'model',
      content: '', // Empty initially
      timestamp: Date.now()
    }]);

    try {
      let accumulatedResponse = "";
      
      await streamGeminiResponse(
        messages, // Pass history *excluding* the one we just added optimistically is handled by the service generally, but here we pass previous state
        userText,
        (chunk) => {
          accumulatedResponse += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMessageId 
                ? { ...msg, content: accumulatedResponse } 
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md md:bottom-8 md:right-8">
      {/* Container with Glassmorphism */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-gem-500/30 rounded-2xl shadow-2xl shadow-gem-900/50 flex flex-col h-[600px] max-h-[80vh] overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-gem-400 to-gem-600 rounded-lg shadow-lg rotate-45">
               <SparklesIcon className="w-5 h-5 text-white -rotate-45" />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wide">Gem</h3>
              <p className="text-xs text-gem-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gem-600 text-white rounded-tr-none'
                    : 'bg-slate-800 border border-white/5 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                {msg.content === '' && msg.role === 'model' && (
                   <span className="inline-flex gap-1 items-center h-5">
                     <span className="w-1.5 h-1.5 bg-gem-400 rounded-full animate-bounce delay-0"></span>
                     <span className="w-1.5 h-1.5 bg-gem-400 rounded-full animate-bounce delay-150"></span>
                     <span className="w-1.5 h-1.5 bg-gem-400 rounded-full animate-bounce delay-300"></span>
                   </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/50 border-t border-white/10">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 bg-slate-800 rounded-xl p-1.5 border border-white/5 focus-within:border-gem-500/50 focus-within:ring-1 focus-within:ring-gem-500/50 transition-all shadow-inner"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Gem anything..."
              disabled={isTyping}
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 text-sm focus:ring-0 px-3 py-2"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2 bg-gem-600 hover:bg-gem-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg shadow-gem-900/20"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-500">
              Powered by Gemini 2.5 Flash
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
