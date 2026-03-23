import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface PodcastResult {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl600: string;
  genres: string[];
}

export const PodcastSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PodcastResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=12`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch podcasts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-display font-bold text-text-primary">Discover Podcasts</h1>
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
          <div key={podcast.collectionId} className="group bg-glass p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
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
    </div>
  );
};
