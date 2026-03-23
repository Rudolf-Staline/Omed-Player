import React, { useState, useEffect } from 'react';
import { Cloud, Loader2, Music, RefreshCw } from 'lucide-react';
import { requireDriveAuth, fetchDriveAudioFiles, getDriveAudioStreamUrl } from '../../utils/googleDriveApi';
import { usePlayerStore, type Track } from '../../store/usePlayerStore';
import { TrackList } from '../music/TrackList';

export const DrivePlayer: React.FC = () => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('gdrive_token'));
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setLocalTracks } = usePlayerStore();

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const newToken = await requireDriveAuth();
      if (newToken) {
        setToken(newToken);
      } else {
        setError('Failed to authenticate with Google Drive.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const driveFiles = await fetchDriveAudioFiles(token);
      setFiles(driveFiles);

      // Convert to Track format for Player Store
      const tracks: Track[] = await Promise.all(driveFiles.map(async (file: any) => ({
          id: file.id,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          artist: 'Google Drive',
          album: 'Cloud Storage',
          url: await getDriveAudioStreamUrl(file.id, token), // Stream URL requires fetching blob
          duration: 0, // Cannot determine until played
      })));
      setLocalTracks(tracks);
    } catch (err: any) {
      setError('Failed to fetch files from Google Drive.');
      setToken(null);
      sessionStorage.removeItem('gdrive_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && files.length === 0) {
       loadFiles();
    }
  }, [token]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-display font-bold text-text-primary flex items-center gap-3">
            <Cloud className="text-accent-cyan" size={28} />
            Google Drive
            {token && <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">CONNECTED</span>}
        </h1>
        {token && (
            <button
                onClick={loadFiles}
                disabled={loading}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-text-primary px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/5"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Refresh
            </button>
        )}
      </div>

      {!token ? (
          <div className="flex flex-col items-center justify-center py-20 bg-glass rounded-2xl border border-white/5">
              <Cloud size={64} className="text-accent-cyan mb-6" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Connect Google Drive</h2>
              <p className="text-text-muted text-center max-w-md mb-8">
                 Stream your personal audio files securely from your Google Drive. We only request read access to audio files.
              </p>
              <button
                 onClick={handleConnect}
                 disabled={loading}
                 className="flex items-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-violet text-bg-primary px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Cloud size={20} fill="currentColor" />}
                  Connect Account
              </button>
              {error && <p className="text-accent-rose mt-4">{error}</p>}
          </div>
      ) : (
          <div className="space-y-4">
              {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-4">
                      <Loader2 size={32} className="animate-spin text-accent-cyan" />
                      <p>Scanning Drive for audio files...</p>
                  </div>
              ) : error ? (
                  <div className="text-accent-rose bg-accent-rose/10 p-4 rounded-lg">{error}</div>
              ) : files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-4">
                      <Music size={48} className="opacity-20" />
                      <p>No audio files found in your Google Drive.</p>
                  </div>
              ) : (
                  <TrackList tracks={files.map(file => ({
                      id: file.id,
                      title: file.name.replace(/\.[^/.]+$/, ""),
                      artist: 'Google Drive',
                      album: 'Cloud Storage',
                      url: '', // We resolve URL when played through store context if using localTracks
                      duration: 0
                  }))} />
              )}
          </div>
      )}
    </div>
  );
};
