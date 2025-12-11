import React, { useState } from 'react';
import Hero from './components/Hero';
import GemButton from './components/GemButton';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-gem-500/30">
      
      {/* Main Content */}
      <main>
        <Hero onCallGem={openChat} />
      </main>

      {/* Floating Gem Button */}
      <GemButton onClick={toggleChat} isOpen={isChatOpen} />

      {/* Chat Interface */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
    </div>
  );
};

export default App;
