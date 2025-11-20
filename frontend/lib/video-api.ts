import { STRAPI_BASE_URL } from "./strapi";
import type { VideoSummary, VideoQuestion } from "@/validations/video";

/**
 * Get JWT token from cookies for authenticated requests
 */
function getAuthToken(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";");
  const jwtCookie = cookies.find((c) => c.trim().startsWith("strapi-jwt="));
  return jwtCookie?.split("=")[1];
}

/**
 * Submit a YouTube URL for processing
 */
export async function submitVideo(youtubeUrl: string): Promise<{
  data: VideoSummary | null;
  error: string | null;
}> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { data: null, error: "Not authenticated" };
    }

    const response = await fetch(
      `${STRAPI_BASE_URL}/api/video-summaries/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ youtubeUrl }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result.error?.message || "Failed to submit video",
      };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error submitting video:", error);
    return { data: null, error: "Network error" };
  }
}

/**
 * Get a single video summary by ID
 */
export async function getVideoSummary(id: string | number): Promise<{
  data: VideoSummary | null;
  error: string | null;
}> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { data: null, error: "Not authenticated" };
    }

    const response = await fetch(
      `${STRAPI_BASE_URL}/api/video-summaries/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Don't cache to get real-time status updates
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result.error?.message || "Failed to fetch video summary",
      };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error fetching video summary:", error);
    return { data: null, error: "Network error" };
  }
}

/**
 * Get all video summaries for the authenticated user
 */
export async function getUserVideos(): Promise<{
  data: VideoSummary[] | null;
  error: string | null;
}> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { data: null, error: "Not authenticated" };
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/video-summaries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result.error?.message || "Failed to fetch videos",
      };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error fetching user videos:", error);
    return { data: null, error: "Network error" };
  }
}

/**
 * Ask a question about a video
 */
export async function askQuestion(
  videoSummaryId: number,
  question: string
): Promise<{
  data: VideoQuestion | null;
  error: string | null;
}> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { data: null, error: "Not authenticated" };
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/video-questions/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ videoSummaryId, question }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result.error?.message || "Failed to ask question",
      };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error asking question:", error);
    return { data: null, error: "Network error" };
  }
}

/**
 * Get all questions for a video summary
 */
export async function getQuestions(videoSummaryId: number): Promise<{
  data: VideoQuestion[] | null;
  error: string | null;
}> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { data: null, error: "Not authenticated" };
    }

    const response = await fetch(
      `${STRAPI_BASE_URL}/api/video-questions?videoSummaryId=${videoSummaryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result.error?.message || "Failed to fetch questions",
      };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { data: null, error: "Network error" };
  }
}
