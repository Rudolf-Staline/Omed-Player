export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  duration: number; // in seconds
  audioUrl: string;
  artworkUrl?: string;
  podcastTitle: string;
}

export const parseRSSFeed = async (url: string, defaultArtwork?: string, podcastTitle?: string): Promise<PodcastEpisode[]> => {
  try {
    const rss2jsonUrl = `/rss2json-proxy/v1/api.json?rss_url=${encodeURIComponent(url)}&count=1000`;

    const response = await fetch(rss2jsonUrl);
    if (!response.ok) throw new Error(`Failed to fetch RSS feed with status ${response.status}`);

    const data = await response.json();

    if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to parse RSS feed from proxy');
    }

    const channelTitle = data.feed?.title || podcastTitle || 'Unknown Podcast';
    const channelArtwork = data.feed?.image || defaultArtwork;

    const episodes: PodcastEpisode[] = data.items.map((item: any, index: number) => {
        // Parse duration if available (itunes_duration can be string "HH:MM:SS" or MM:SS)
        let duration = 0;
        if (item.enclosure?.duration) {
            duration = parseInt(item.enclosure.duration, 10);
        } else if (item.itunes_duration) {
             const parts = String(item.itunes_duration).split(':').reverse();
             duration = parts.reduce((acc, part, i) => acc + parseInt(part, 10) * Math.pow(60, i), 0);
        }

        return {
            id: item.guid || item.enclosure?.link || `episode-${index}`,
            title: item.title || `Episode ${index + 1}`,
            description: item.description?.replace(/<[^>]*>?/gm, '') || '', // strip html
            pubDate: new Date(item.pubDate).toLocaleDateString(),
            duration: isNaN(duration) ? 0 : duration,
            audioUrl: item.enclosure?.link || '',
            artworkUrl: item.thumbnail || channelArtwork,
            podcastTitle: channelTitle
        };
    }).filter((ep: PodcastEpisode) => ep.audioUrl); // Only keep episodes with valid audio links

    return episodes;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw error;
  }
};
