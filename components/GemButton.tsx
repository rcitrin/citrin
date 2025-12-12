import React from 'react';
import { SparklesIcon } from './Icons';

interface GemButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const GemButton: React.FC<GemButtonProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null; // Hide when chat is open

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 group flex items-center justify-center"
      aria-label="Open Class Ai"
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-gem-400 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-slow"></div>
      
      {/* Gem Body */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-gem-300 to-gem-600 rounded-2xl rotate-45 border-2 border-white/50 shadow-2xl shadow-gem-500/50 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-90 animate-float">
        {/* Inner Facet */}
        <div className="w-10 h-10 bg-gradient-to-tl from-white/20 to-transparent rotate-0 absolute inset-0 m-auto rounded-lg"></div>
        
        <SparklesIcon className="w-8 h-8 text-white -rotate-45 group-hover:-rotate-90 transition-transform duration-300" />
      </div>
      
      {/* Label Tooltip */}
      <span className="absolute right-20 bg-slate-800 text-gem-100 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-gem-700/50 shadow-lg translate-x-2 group-hover:translate-x-0">
        Class Ai
      </span>
    </button>
  );
};

export default GemButton;