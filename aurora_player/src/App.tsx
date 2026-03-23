import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { Library } from './features/music/Library';
import { PodcastSearch } from './features/podcasts/PodcastSearch';
import { PodcastDetail } from './features/podcasts/PodcastDetail';
import { VideoPlayer } from './features/video/VideoPlayer';

// A simple placeholder for settings page
const SettingsPage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-display font-bold text-text-primary">Settings</h1>
    <p className="text-text-muted">Configuration options will go here.</p>
  </div>
);

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

const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/music" replace />} />
          <Route path="/music" element={<AnimatedRoute><Library /></AnimatedRoute>} />
          <Route path="/podcasts" element={<AnimatedRoute><PodcastSearch /></AnimatedRoute>} />
          <Route path="/podcasts/:id" element={<AnimatedRoute><PodcastDetail /></AnimatedRoute>} />
          <Route path="/video" element={<AnimatedRoute><VideoPlayer /></AnimatedRoute>} />
          <Route path="/settings" element={<AnimatedRoute><SettingsPage /></AnimatedRoute>} />
          {/* Fallback for unhandled routes */}
          <Route path="*" element={<AnimatedRoute><div className="text-text-muted mt-8 text-center">Page Not Found or Not Implemented Yet</div></AnimatedRoute>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
