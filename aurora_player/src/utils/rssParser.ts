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

const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
];

export const parseRSSFeed = async (url: string, defaultArtwork?: string, podcastTitle?: string): Promise<PodcastEpisode[]> => {
  let xmlText = '';
  let lastError: any = null;

  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(url);
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Proxy failed with status ${response.status}`);

      if (proxyUrl.includes('allorigins.win')) {
        const data = await response.json();
        xmlText = data.contents;
      } else {
        xmlText = await response.text();
      }

      // If we got some text that looks like XML, break out of the loop
      if (xmlText && xmlText.trim().startsWith('<')) {
        break;
      } else {
        throw new Error('Response is not valid XML');
      }
    } catch (err) {
      console.warn(`Proxy failed:`, err);
      lastError = err;
    }
  }

  if (!xmlText) {
    throw new Error(lastError?.message || 'Failed to fetch RSS feed using all available proxies.');
  }

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const items = xmlDoc.querySelectorAll('item');
    const episodes: PodcastEpisode[] = [];

    // Fallback podcast info
    const channelTitle = xmlDoc.querySelector('channel > title')?.textContent || podcastTitle || 'Unknown Podcast';
    let channelArtwork = xmlDoc.querySelector('channel > image > url')?.textContent || defaultArtwork;

    // Check for itunes:image
    const itunesImage = xmlDoc.querySelector('channel > itunes\\:image, image');
    if (itunesImage && itunesImage.getAttribute('href')) {
        channelArtwork = itunesImage.getAttribute('href') || channelArtwork;
    }

    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || `Episode ${index + 1}`;
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';

      const enclosure = item.querySelector('enclosure');
      const audioUrl = enclosure?.getAttribute('url') || '';

      // Parse duration
      let duration = 0;
      const durationStr = item.querySelector('itunes\\:duration, duration')?.textContent;
      if (durationStr) {
        const parts = durationStr.split(':').reverse();
        duration = parts.reduce((acc, part, i) => acc + parseInt(part, 10) * Math.pow(60, i), 0);
      }

      // Check for episode specific artwork
      let episodeArtwork = channelArtwork;
      const itemItunesImage = item.querySelector('itunes\\:image, image');
      if (itemItunesImage && itemItunesImage.getAttribute('href')) {
          episodeArtwork = itemItunesImage.getAttribute('href') || episodeArtwork;
      }

      if (audioUrl) {
        episodes.push({
          id: item.querySelector('guid')?.textContent || audioUrl,
          title,
          description: description.replace(/<[^>]*>?/gm, ''), // strip html tags
          pubDate: new Date(pubDate).toLocaleDateString(),
          duration,
          audioUrl,
          artworkUrl: episodeArtwork,
          podcastTitle: channelTitle
        });
      }
    });

    return episodes;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
};
