import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

export interface VideoMetadata {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
}

export interface YouTubeService {
  extractVideoId(url: string): string | null;
  getVideoMetadata(videoId: string): Promise<VideoMetadata>;
  downloadAudio(videoId: string): Promise<Buffer>;
}

class YouTubeServiceImpl implements YouTubeService {
  /**
   * Extract video ID from various YouTube URL formats
   * Supports:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   */
  extractVideoId(url: string): string | null {
    try {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      return null;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return null;
    }
  }

  /**
   * Get video metadata using ytdl-core
   * Note: YouTube Data API skeleton - currently uses ytdl-core for metadata
   */
  async getVideoMetadata(videoId: string): Promise<VideoMetadata> {
    try {
      const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
      const info = await ytdl.getInfo(videoURL);

      const videoDetails = info.videoDetails;

      return {
        videoId,
        title: videoDetails.title,
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url || "",
        duration: parseInt(videoDetails.lengthSeconds, 10),
      };
    } catch (error) {
      console.error("Error fetching video metadata:", error);
      throw new Error(`Failed to fetch video metadata: ${error.message}`);
    }
  }

  /**
   * Download audio from YouTube video
   * Returns audio as Buffer for processing
   */
  async downloadAudio(videoId: string): Promise<Buffer> {
    try {
      const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

      // Check video duration first to avoid processing very long videos
      const info = await ytdl.getInfo(videoURL);
      const duration = parseInt(info.videoDetails.lengthSeconds, 10);
      const maxDuration = parseInt(process.env.MAX_VIDEO_DURATION || "3600", 10); // Default 1 hour

      if (duration > maxDuration) {
        throw new Error(`Video is too long (${Math.floor(duration / 60)} minutes). Maximum allowed: ${Math.floor(maxDuration / 60)} minutes.`);
      }

      // Download audio stream
      const audioStream = ytdl(videoURL, {
        filter: "audioonly",
        quality: "lowestaudio", // Use lowest quality to reduce file size and cost
      });

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      return new Promise((resolve, reject) => {
        audioStream.on("data", (chunk) => chunks.push(chunk));
        audioStream.on("end", () => resolve(Buffer.concat(chunks)));
        audioStream.on("error", (error) => reject(error));
      });
    } catch (error) {
      console.error("Error downloading audio:", error);
      throw new Error(`Failed to download audio: ${error.message}`);
    }
  }
}

export const youtubeService: YouTubeService = new YouTubeServiceImpl();
