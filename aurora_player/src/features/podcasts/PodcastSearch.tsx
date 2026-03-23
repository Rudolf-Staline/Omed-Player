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
  const [visibleCount, setVisibleCount] = useState(100);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setVisibleCount(100); // reset visible count on new search

    try {
      const response = await fetch(`/itunes-proxy/search?term=${encodeURIComponent(query)}&media=podcast&entity=podcast&limit=200`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch podcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-3xl font-display font-bold text-text-primary">Discover Podcasts</h1>
          {results.length > 0 && (
            <span className="text-sm text-text-muted mb-1 font-mono">{results.length} podcasts found</span>
          )}
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
        {results.slice(0, visibleCount).map((podcast) => (
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

      {results.length > visibleCount && (
        <div className="flex justify-center pt-8 pb-12">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-text-primary rounded-xl font-medium transition-all shadow-lg hover:shadow-xl border border-white/5"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};
