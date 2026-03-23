import { Layout } from './components/Layout';
import { Library } from './features/music/Library';
import { PodcastSearch } from './features/podcasts/PodcastSearch';
import { VideoPlayer } from './features/video/VideoPlayer';

function App() {
  return (
    <Layout>
      <div className="space-y-16 pb-20">
        <header>
          <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">Good evening</h1>
          <p className="text-text-muted mt-2">Welcome to Aurora Player</p>
        </header>

        <section id="music">
          <Library />
        </section>

        <section id="podcasts" className="pt-8 border-t border-white/5">
          <PodcastSearch />
        </section>

        <section id="video" className="pt-8 border-t border-white/5">
          <VideoPlayer />
        </section>
      </div>
    </Layout>
  );
}

export default App;
