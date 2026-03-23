export const getFileMetadata = async (file: File): Promise<{ title: string; artist: string; album: string }> => {
  // In a real application, you'd use jsmediatags or music-metadata-browser here.
  // Due to browser constraints and sandboxing, we'll extract basic info from the filename
  // as a robust fallback for the MVP.

  let title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
  let artist = 'Unknown Artist';
  let album = 'Local Files';

  // Basic parsing assuming "Artist - Title" format
  if (title.includes(' - ')) {
    const parts = title.split(' - ');
    artist = parts[0].trim();
    title = parts.slice(1).join(' - ').trim();
  }

  return { title, artist, album };
};

export const scanDirectory = async (dirHandle: any): Promise<File[]> => {
  const files: File[] = [];
  const supportedExtensions = ['.mp3', '.flac', '.wav', '.m4a', '.ogg'];

  try {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        const extension = file.name.slice((Math.max(0, file.name.lastIndexOf('.')) || Infinity)).toLowerCase();

        if (supportedExtensions.includes(extension)) {
          files.push(file);
        }
      } else if (entry.kind === 'directory') {
        // Recursively scan subdirectories
        const subFiles = await scanDirectory(entry);
        files.push(...subFiles);
      }
    }
  } catch (err) {
    console.error("Error scanning directory:", err);
  }

  return files;
};
