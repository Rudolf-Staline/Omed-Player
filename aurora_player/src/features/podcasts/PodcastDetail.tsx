import React, { useState, useEffect } from 'react';
import { Play, Loader2, ArrowLeft, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseRSSFeed, type PodcastEpisode } from '../../utils/rssParser';
import { audioEngine } from '../../core/audio_engine';
import { usePlayerStore, type Track } from '../../store/usePlayerStore';
import { geminiApi } from '../../utils/geminiApi';

export const PodcastDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const podcast = location.state?.podcast;

  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const { favorites, toggleFavorite } = usePlayerStore();

  useEffect(() => {
    if (!podcast || !podcast.feedUrl) {
      setError('Invalid podcast data.');
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await parseRSSFeed(podcast.feedUrl, podcast.artworkUrl600, podcast.collectionName);
        setEpisodes(data);

        // Use Gemini API to generate a smart recommendation based on the first few episodes
        if (data.length > 0) {
           const sampleTitles = data.slice(0, 3).map(e => e.title);
           const recs = await geminiApi.getSmartRecommendations([podcast.collectionName, ...sampleTitles]);
           setSummary(recs);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load episodes');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [podcast]);

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    const track: Track = {
      id: episode.id,
      title: episode.title,
      artist: episode.podcastTitle,
      album: 'Podcast Episode',
      url: episode.audioUrl,
      artworkUrl: episode.artworkUrl,
      duration: episode.duration,
    };
    audioEngine.play(track);
  };

  if (!podcast) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-text-muted">No podcast selected.</p>
        <button onClick={() => navigate('/podcasts')} className="text-accent-cyan hover:underline">Go back to Search</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors bg-white/5 px-4 py-2 rounded-lg w-fit"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 max-w-sm sticky top-6">
          <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl glow-cyan mb-6">
            <img src={podcast.artworkUrl600} alt={podcast.collectionName} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-2">{podcast.collectionName}</h1>
          <p className="text-lg text-text-muted mb-4">{podcast.artistName}</p>
          <div className="flex flex-wrap gap-2 mb-6">
             {podcast.genres?.slice(0, 3).map((genre: string, i: number) => (
               <span key={i} className="text-xs font-medium px-2 py-1 bg-white/10 rounded-full text-text-primary">{genre}</span>
             ))}
          </div>

          {summary && (
            <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 text-sm text-text-muted">
                <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <span className="text-accent-cyan">✨</span> Smart Insight
                </h3>
                <div className="whitespace-pre-wrap">{summary}</div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-display font-semibold mb-6 border-b border-white/5 pb-2">Episodes</h2>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-accent-cyan" size={32} />
            </div>
          )}

          {error && <div className="text-accent-rose bg-accent-rose/10 p-4 rounded-lg">{error}</div>}

          {!loading && !error && (
            <div className="space-y-4">
              {episodes.map((episode) => (
                <div key={episode.id} className="group bg-glass p-4 rounded-xl hover:bg-white/10 transition-colors border-l-4 border-transparent hover:border-accent-cyan">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handlePlayEpisode(episode)}
                      className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-text-primary hover:bg-accent-cyan hover:text-bg-primary transition-colors"
                    >
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </button>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-semibold text-text-primary mb-1 line-clamp-2">{episode.title}</h3>
                      <p className="text-sm text-text-muted line-clamp-2 mb-3">{episode.description}</p>
                      <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
                        <span>{episode.pubDate}</span>
                        {episode.duration > 0 && (
                          <span>{Math.floor(episode.duration / 60)} min</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(episode.id); }}
                      className={`shrink-0 transition-colors self-center p-2 rounded-full opacity-0 group-hover:opacity-100 ${favorites.includes(episode.id) ? 'text-accent-rose opacity-100' : 'text-text-muted hover:text-accent-rose hover:bg-white/5'}`}
                    >
                      <Heart size={20} fill={favorites.includes(episode.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
