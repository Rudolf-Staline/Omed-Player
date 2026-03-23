export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
        // Fallback for some sites that might block the request
        const retryRes = await fetch(url, { method: 'GET' });
        if (!retryRes.ok) {
            return res.status(retryRes.status).send(`Failed to fetch from source: ${retryRes.statusText}`);
        }
        const data = await retryRes.text();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', retryRes.headers.get('content-type') || 'text/plain');
        return res.status(200).send(data);
    }

    const data = await response.text();
    const contentType = response.headers.get('content-type');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', contentType || 'text/plain');
    
    return res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy failed to fetch the URL', details: error.message });
  }
}
