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
    const prompt = `Agis comme un expert en résumé de podcasts. Fournis un résumé concis en 3 points à puces de l'épisode suivant. Réponds UNIQUEMENT en français.\nTitre: ${title}\nDescription: ${description}`;
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
    const prompt = `Basé sur les métadonnées de la chanson suivante, suggère une seule catégorie d'humeur principale (ex: Relax, Focus, Énergie, Triste, Entraînant, Calme). Réponds avec UN SEUL mot en français.\nTitre: ${title}\nArtiste: ${artist}\nTags: ${tags.join(', ')}`;
    return this.generateContent(prompt);
  },

  /**
   * Provides smart recommendations based on listening history.
   * @param history Array of recently played track or podcast titles.
   * @returns A Promise resolving to a list of recommendations.
   */
  async getSmartRecommendations(history: string[]): Promise<string> {
    const prompt = `Basé sur l'historique d'écoute de l'utilisateur, suggère 5 artistes, podcasts ou genres similaires qu'il pourrait apprécier. Formate comme une liste à puces propre. Réponds UNIQUEMENT en français.\nHistorique: ${history.join(', ')}`;
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
    const isFrench = prompt.toLowerCase().includes('français') || prompt.toLowerCase().includes('french');
    if (prompt.includes('résumé') || prompt.includes('summarize')) {
      return isFrench 
        ? "• Point clé 1 : Introduction au sujet.\n• Point clé 2 : Discussion approfondie des points principaux.\n• Point clé 3 : Conclusion et perspectives d'avenir."
        : "• Key takeaway 1: Introduction to the topic.\n• Key takeaway 2: In-depth discussion of main points.\n• Key takeaway 3: Conclusion and future outlook.";
    }
    if (prompt.includes('humeur') || prompt.includes('mood')) {
      return isFrench ? "Calme" : "Chill";
    }
    if (prompt.includes('historique') || prompt.includes('history')) {
      return "1. The Midnight\n2. Kavinsky\n3. FM-84\n4. Gunship\n5. Timecop1983";
    }
    return isFrench 
        ? "Ceci est une réponse simulée de l'IA Omed."
        : "This is a mock response from the Omed AI scaffold.";
  }
};
