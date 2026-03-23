import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomPlayer } from './BottomPlayer';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-bg-primary text-text-primary">
       {/* Mobile Header */}
       <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-bg-secondary z-30">
          <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet text-white shadow-lg glow-cyan overflow-hidden">
                <img src="/app-logo.png" alt="Omed Logo" className="w-full h-full object-cover" />
              </div>
             <h1 className="text-xl font-bold tracking-tight text-text-primary">Omed</h1>
          </div>
          <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
             className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
          >
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
       </div>

      <div className="flex flex-1 overflow-hidden relative w-full">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-10 pb-24 md:pb-6">
          {children}
        </main>
      </div>
      <BottomPlayer />
    </div>
  );
};
