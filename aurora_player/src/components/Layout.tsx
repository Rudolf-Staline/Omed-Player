import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomPlayer } from './BottomPlayer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-bg-primary text-text-primary">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
      <BottomPlayer />
    </div>
  );
};
