import React from 'react';
import { NavLink } from 'react-router-dom';
import { Music, Podcast, Video, Settings, Library, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/music', label: 'Music', icon: <Music size={18} /> },
  { path: '/podcasts', label: 'Podcasts', icon: <Podcast size={18} /> },
  { path: '/video', label: 'Video', icon: <Video size={18} /> },
];

const libraryItems = [
  { path: '/local-files', label: 'Local Files', icon: <Library size={18} /> },
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

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 flex-col border-r border-white/5 bg-bg-secondary p-4 hidden md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet text-white shadow-lg glow-cyan">
          <Music size={18} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-text-primary">Aurora</h1>
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

      <div className="mt-auto">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white/10 text-accent-cyan shadow-sm border border-white/5'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            }`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};
