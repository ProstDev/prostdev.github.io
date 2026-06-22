import { getCollection, type CollectionEntry } from 'astro:content';

let cache: Map<string, CollectionEntry<'transcripts'>> | null = null;

async function transcriptMap() {
  if (!cache) {
    const entries = await getCollection('transcripts');
    // The glob loader lowercases entry ids, so key the map case-insensitively.
    cache = new Map(entries.map((e) => [e.id.toLowerCase(), e]));
  }
  return cache;
}

/**
 * Returns the transcript entry for a video, or null if none exists.
 * Transcripts live at src/content/transcripts/<youtubeId>.md.
 * Avoids getEntry's "not found" build warnings for videos without transcripts.
 */
export async function getTranscript(youtubeId: string) {
  const map = await transcriptMap();
  return map.get(youtubeId.toLowerCase()) ?? null;
}
