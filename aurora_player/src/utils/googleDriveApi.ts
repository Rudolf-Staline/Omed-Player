const SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.appdata';

export const initGoogleDriveAuth = (): Promise<string | null> => {
  return new Promise((resolve) => {
    // If we already have a token, just return it
    const token = sessionStorage.getItem('gdrive_token');
    if (token) {
        resolve(token);
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error !== undefined) {
            console.error('Google Auth Error:', response);
            resolve(null);
          } else {
            sessionStorage.setItem('gdrive_token', response.access_token);
            resolve(response.access_token);
          }
        },
      });
      // Try to auto-authorize without popup if possible
      client.requestAccessToken({ prompt: '' });
    };
    document.head.appendChild(script);
  });
};

export const requireDriveAuth = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const token = sessionStorage.getItem('gdrive_token');
    if (token) return resolve(token);

    if (!(window as any).google) return resolve(null); // Should be loaded by init

    const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error !== undefined) {
            resolve(null);
          } else {
            sessionStorage.setItem('gdrive_token', response.access_token);
            resolve(response.access_token);
          }
        },
    });
    client.requestAccessToken({ prompt: 'consent' });
  });
};

import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const handleApiError = (res: Response) => {
    if (res.status === 401) {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        throw new Error('Session expirée. Reconnecte-toi.');
    }
};

export const fetchDriveAudioFiles = async (token: string) => {
    const query = encodeURIComponent("mimeType contains 'audio'");
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size,thumbnailLink,modifiedTime)&pageSize=200`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });

    handleApiError(res);
    if (!res.ok) throw new Error('Failed to fetch from Drive');
    const data = await res.json();
    return data.files || [];
};

const audioBlobCache = new Map<string, string>();

export const getDriveAudioStreamUrl = async (fileId: string, token: string): Promise<string> => {
    if (audioBlobCache.has(fileId)) {
        return audioBlobCache.get(fileId)!;
    }

    const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    handleApiError(res);
    if (!res.ok) throw new Error('Failed to download audio from Drive');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioBlobCache.set(fileId, url);
    return url;
};
