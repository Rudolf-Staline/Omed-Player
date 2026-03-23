import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PodcastResult {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl600: string;
  genres: string[];
  feedUrl?: string;
}

export const PodcastSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PodcastResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  const fetchPodcasts = async (searchQuery: string, offset: number = 0) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/itunes-proxy/search?term=${encodeURIComponent(searchQuery)}&media=podcast&entity=podcast&limit=100&offset=${offset}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const fetchedResults = data.results || [];

      if (offset === 0) {
        setResults(fetchedResults);
      } else {
        setResults(prev => [...prev, ...fetchedResults]);
      }

      setHasMore(fetchedResults.length >= 100);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch podcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchPodcasts(query, 0);
  };

  const handleLoadMore = () => {
    fetchPodcasts(query, results.length);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-3xl font-display font-bold text-text-primary">Discover Podcasts</h1>
        </div>
        <form onSubmit={handleSearch} className="relative max-w-2xl w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for podcasts..."
            className="w-full bg-glass border border-white/10 rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-text-primary px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="text-accent-rose bg-accent-rose/10 p-4 rounded-lg">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {results.map((podcast) => (
          <div
            key={podcast.collectionId}
            className="group bg-glass p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
            onClick={() => navigate(`/podcasts/${podcast.collectionId}`, { state: { podcast } })}
          >
            <div className="aspect-square w-full rounded-lg overflow-hidden shadow-lg mb-4">
              <img
                src={podcast.artworkUrl600}
                alt={podcast.collectionName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-text-primary text-sm truncate" title={podcast.collectionName}>
              {podcast.collectionName}
            </h3>
            <p className="text-xs text-text-muted mt-1 truncate" title={podcast.artistName}>
              {podcast.artistName}
            </p>
          </div>
        ))}
        {results.length === 0 && !loading && !error && query && (
          <p className="col-span-full text-text-muted">No results found for "{query}"</p>
        )}
      </div>

      {results.length > 0 && (
        <div className="flex flex-col items-center pt-8 pb-12 gap-4">
          <span className="text-sm text-text-muted font-mono">Showing {results.length} podcasts</span>
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-text-primary rounded-xl font-medium transition-all shadow-lg hover:shadow-xl border border-white/5 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
};
