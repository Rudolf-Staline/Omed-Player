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
    // Vite proxies (/raw-proxy) only work in development.
    // In production, we fallback to AllOrigins CORS proxy.
    const isDev = import.meta.env.DEV;
    const corsProxyUrl = isDev 
        ? `/raw-proxy?url=${encodeURIComponent(url)}`
        : `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(corsProxyUrl, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Failed to fetch RSS feed with status ${response.status}`);
    
    let xmlText = '';
    if (isDev) {
        xmlText = await response.text();
    } else {
        const data = await response.json();
        xmlText = data.contents;
    }
    
    if (!xmlText) {
        throw new Error('Failed to load RSS feed contents');
    }

    const parser = new window.DOMParser();
    const doc = parser.parseFromString(xmlText, "text/xml");

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error('Invalid XML feed format');
    }

    const channelTitle = doc.querySelector('channel > title')?.textContent || podcastTitle || 'Unknown Podcast';
    const channelArtwork = doc.querySelector('channel > image > url')?.textContent || doc.querySelector('channel > itunes\\:image')?.getAttribute('href') || defaultArtwork;

    const items = Array.from(doc.querySelectorAll('item'));
    
    const episodes: PodcastEpisode[] = items.map((item, index) => {
        const enclosure = item.querySelector('enclosure');
        const audioUrl = enclosure?.getAttribute('url') || '';
        const guid = item.querySelector('guid')?.textContent;
        
        let duration = 0;
        const itunesDuration = item.getElementsByTagName('itunes:duration')[0]?.textContent;
        if (itunesDuration) {
            if (itunesDuration.includes(':')) {
                 const parts = String(itunesDuration).split(':').reverse();
                 duration = parts.reduce((acc, part, i) => acc + parseInt(part, 10) * Math.pow(60, i), 0);
            } else {
                 duration = parseInt(itunesDuration, 10);
            }
        }

        const itunesImage = item.getElementsByTagName('itunes:image')[0]?.getAttribute('href');
        const mediaContent = item.getElementsByTagName('media:content')[0]?.getAttribute('url');

        // Extract and strip description
        const descriptionNode = item.querySelector('description');
        const contentEncoded = item.getElementsByTagName('content:encoded')[0];
        const rawDescription = contentEncoded?.textContent || descriptionNode?.textContent || '';
        const cleanDescription = rawDescription.replace(/<[^>]*>?/gm, '');

        let pubDateStr = item.querySelector('pubDate')?.textContent || '';
        let pubDate = '';
        if (pubDateStr) {
            try {
                pubDate = new Date(pubDateStr).toLocaleDateString();
            } catch (e) {
                pubDate = pubDateStr;
            }
        }

        return {
            id: guid || audioUrl || `episode-${index}`,
            title: item.querySelector('title')?.textContent || `Episode ${index + 1}`,
            description: cleanDescription,
            pubDate: pubDate,
            duration: isNaN(duration) ? 0 : duration,
            audioUrl: audioUrl,
            artworkUrl: itunesImage || mediaContent || channelArtwork,
            podcastTitle: channelTitle
        };
    }).filter((ep: PodcastEpisode) => ep.audioUrl); // Only keep episodes with valid audio links
    
    return episodes;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw error;
  }
};
