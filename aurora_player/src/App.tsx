import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { Library } from './features/music/Library';
import { PodcastSearch } from './features/podcasts/PodcastSearch';
import { PodcastDetail } from './features/podcasts/PodcastDetail';
import { VideoPlayer } from './features/video/VideoPlayer';
import { SettingsPage } from './features/settings/SettingsPage';
import { FavoritesPage } from './features/music/FavoritesPage';
import { useSettingsStore } from './store/useSettingsStore';

const pageVariants = {
  initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)' },
  out: { opacity: 0, y: -10, filter: 'blur(4px)' }
};

const pageTransition: any = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25
};

const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { animationsEnabled } = useSettingsStore();

  if (!animationsEnabled) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const { theme, density, animationsEnabled } = useSettingsStore();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = density;
  }, [theme, density]);

  return (
    <Layout>
      <AnimatePresence mode="wait" initial={animationsEnabled}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/music" replace />} />
          <Route path="/music" element={<AnimatedRoute><Library /></AnimatedRoute>} />
          <Route path="/podcasts" element={<AnimatedRoute><PodcastSearch /></AnimatedRoute>} />
          <Route path="/podcasts/:id" element={<AnimatedRoute><PodcastDetail /></AnimatedRoute>} />
          <Route path="/video" element={<AnimatedRoute><VideoPlayer /></AnimatedRoute>} />
          <Route path="/settings" element={<AnimatedRoute><SettingsPage /></AnimatedRoute>} />
          <Route path="/local-files" element={<Navigate to="/music" replace />} />
          <Route path="/favorites" element={<AnimatedRoute><FavoritesPage /></AnimatedRoute>} />
          {/* Fallback for unhandled routes */}
          <Route path="*" element={<AnimatedRoute><div className="text-text-muted mt-8 text-center">Page Not Found or Not Implemented Yet</div></AnimatedRoute>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
