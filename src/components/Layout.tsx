import React from 'react';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  toolbarProps?: React.ComponentProps<typeof Toolbar>;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar, toolbarProps }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Toolbar {...toolbarProps} />
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar || <Sidebar />}
        
        <main className="flex-1 relative overflow-hidden bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};
