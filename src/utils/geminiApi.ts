/**
 * Utility functions for interacting with Google's Gemini API via AI Studio.
 * This file serves as a scaffold for the AI features of Aurora Player.
 */

import { useSettingsStore } from '../store/useSettingsStore';

export const geminiApi = {
  /**
   * Generates a 3-point summary for a podcast episode based on its title and description.
   * @param title The title of the podcast episode.
   * @param description The description or show notes of the episode.
   * @returns A Promise resolving to the summary text.
   */
  async summarizePodcast(title: string, description: string): Promise<string> {
    const prompt = `Act as an expert podcast summarizer. Provide a concise, 3-point bulleted summary of the following podcast episode.\nTitle: ${title}\nDescription: ${description}`;
    return this.generateContent(prompt);
  },

  /**
   * Analyzes track metadata to detect its mood (Relax, Focus, Energy, Sad, etc.).
   * @param title Track title.
   * @param artist Artist name.
   * @param tags Array of tags or genres.
   * @returns A Promise resolving to a single word indicating the mood.
   */
  async detectMood(title: string, artist: string, tags: string[] = []): Promise<string> {
    const prompt = `Based on the following song metadata, suggest a single primary mood category (e.g., Relax, Focus, Energy, Sad, Upbeat, Chill). Respond with ONLY the mood category word.\nTitle: ${title}\nArtist: ${artist}\nTags: ${tags.join(', ')}`;
    return this.generateContent(prompt);
  },

  /**
   * Provides smart recommendations based on listening history.
   * @param history Array of recently played track or podcast titles.
   * @returns A Promise resolving to a list of recommendations.
   */
  async getSmartRecommendations(history: string[]): Promise<string> {
    const prompt = `Based on the user's listening history, suggest 5 similar artists, podcasts, or genres they might enjoy. Format as a clean, bulleted list.\nHistory: ${history.join(', ')}`;
    return this.generateContent(prompt);
  },

  /**
   * Generic method to call the Gemini API.
   * @param prompt The text prompt to send to the model.
   * @returns The generated text response.
   */
  async generateContent(prompt: string): Promise<string> {
    const userKey = useSettingsStore.getState().geminiApiKey;
    const configKey = import.meta.env.VITE_GEMINI_API_KEY;
    const activeKey = (userKey || configKey || '').trim();

    if (!activeKey || activeKey === 'YOUR_API_KEY_HERE') {
      console.warn('Gemini API Key is missing. Returning mock response.');
      return this.getMockResponse(prompt);
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${activeKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Details:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  },

  /**
   * Fallback mock responses when API key is not configured.
   */
  getMockResponse(prompt: string): string {
    if (prompt.includes('summarize')) {
      return "• Key takeaway 1: Introduction to the topic.\n• Key takeaway 2: In-depth discussion of main points.\n• Key takeaway 3: Conclusion and future outlook.";
    }
    if (prompt.includes('mood')) {
      return "Chill";
    }
    if (prompt.includes('history')) {
      return "1. The Midnight\n2. Kavinsky\n3. FM-84\n4. Gunship\n5. Timecop1983";
    }
    return "This is a mock response from the Gemini AI scaffold.";
  }
};
