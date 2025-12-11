import React from 'react';
import { SparklesIcon, ChevronRightIcon, MessageSquareIcon } from './Icons';

interface HeroProps {
  onCallGem: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCallGem }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-950 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gem-900/30 rounded-full blur-3xl mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Title - Smaller text but same gradient look */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gem-300 via-gem-400 to-purple-400">
            Citrin: TBA Computer Science
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Teaching The Next Generation of Computer Scientists at TechBoston Academy
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onCallGem}
            className="group relative px-8 py-4 bg-gem-600 hover:bg-gem-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-gem-900/40 hover:shadow-gem-500/20 hover:-translate-y-1 flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Class Ai</span>
            <MessageSquareIcon className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          
          <a 
            href="https://rcitrin.github.io/editor/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 rounded-xl font-semibold transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            TBA Pseudocode Editor
            <ChevronRightIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;