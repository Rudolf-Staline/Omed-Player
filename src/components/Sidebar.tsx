import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Music, Podcast, Video, Settings, Library, Heart, Bell, ListMusic, Cloud, LogOut, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { SyncStatus } from './SyncStatus';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
  { path: '/music', label: 'Music', icon: <Music size={18} /> },
  { path: '/podcasts', label: 'Podcasts', icon: <Podcast size={18} /> },
  { path: '/video', label: 'Video', icon: <Video size={18} /> },
];

const libraryItems = [
  { path: '/local-files', label: 'Local Files', icon: <Library size={18} /> },
  { path: '/drive', label: 'Google Drive', icon: <Cloud size={18} /> },
  { path: '/playlists', label: 'Playlists', icon: <ListMusic size={18} /> },
  { path: '/subscriptions', label: 'Subscriptions', icon: <Bell size={18} /> },
  { path: '/history', label: 'History', icon: <Clock size={18} /> },
  { path: '/favorites', label: 'Favorites', icon: <Heart size={18} /> },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
           className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" 
           onClick={onClose}
        />
      )}
      
      <aside className={`w-64 flex-col border-r border-white/5 bg-bg-secondary p-4 absolute md:static inset-y-0 left-0 z-40 transition-transform duration-300 h-full md:translate-x-0 md:flex ${isOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'}`}>
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet text-white shadow-lg glow-cyan overflow-hidden">
            <img src="/app-logo.png" alt="Omed Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">Omed</h1>
        </div>
      </div>

      <nav className="space-y-6">
        <div>
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Discover</h2>
          <motion.ul 
            className="space-y-1"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => (
              <motion.li key={item.path} variants={itemVariants}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-white/10 text-accent-cyan shadow-sm border border-white/5' 
                        : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div>
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Library</h2>
          <motion.ul 
            className="space-y-1"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {libraryItems.map((item) => (
              <motion.li key={item.path} variants={itemVariants}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-white/10 text-accent-cyan shadow-sm border border-white/5' 
                        : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </nav>

      <div className="mt-auto relative">
        <button 
           onClick={() => setShowProfileMenu(!showProfileMenu)}
           className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
        >
           {user?.avatar ? (
               <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full bg-white/10 object-cover shrink-0" />
           ) : (
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                   <Settings size={18} />
               </div>
           )}
           <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium text-text-primary truncate">{user?.name || 'User'}</p>
               <p className="text-xs text-text-muted truncate">{user?.email || 'email@gmail.com'}</p>
           </div>
        </button>

        {showProfileMenu && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-bg-secondary border border-white/10 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                <button 
                    onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 text-text-primary hover:bg-white/10 transition-colors text-sm font-medium"
                >
                    <Settings size={16} /> Paramètres
                </button>
                <div className="h-px bg-white/10 my-1 w-full" />
                <button 
                    onClick={() => { logout(); setShowProfileMenu(false); }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 text-accent-rose hover:bg-accent-rose/10 transition-colors text-sm font-medium"
                >
                    <LogOut size={16} /> Déconnexion
                </button>
            </div>
        )}
      </div>
      <div className="mt-4 border-t border-white/5 pt-4">
         <SyncStatus />
      </div>
    </aside>
    </>
  );
};
