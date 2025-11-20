import { cookies } from "next/headers";
import { STRAPI_BASE_URL } from "@/lib/strapi";
import { VideoChat } from "@/components/dashboard/video-chat";
import type { VideoSummary, VideoQuestion } from "@/validations/video";
import { notFound } from "next/navigation";
import { Loader2, Clock, AlertCircle } from "lucide-react";

async function getVideoSummary(id: string): Promise<VideoSummary | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt")?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(
      `${STRAPI_BASE_URL}/api/video-summaries/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching video summary:", error);
    return null;
  }
}

async function getQuestions(id: string): Promise<VideoQuestion[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt")?.value;

    if (!token) {
      return [];
    }

    const response = await fetch(
      `${STRAPI_BASE_URL}/api/video-questions?videoSummaryId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export default async function SummaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = await getVideoSummary(id);

  if (!summary) {
    notFound();
  }

  const questions =
    summary.status === "completed" ? await getQuestions(id) : [];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusDisplay = () => {
    switch (summary.status) {
      case "processing":
        return (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900 dark:bg-blue-950">
            <Loader2 className="text-primary mx-auto mb-3 h-12 w-12 animate-spin" />
            <h3 className="mb-2 text-lg font-semibold">Processing Video</h3>
            <p className="text-muted-foreground text-sm">
              We&apos;re transcribing and summarizing your video. This usually
              takes 1-3 minutes. Feel free to close this page and check back
              later.
            </p>
          </div>
        );
      case "failed":
        return (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-600 dark:text-red-400" />
            <h3 className="mb-2 text-lg font-semibold">Processing Failed</h3>
            <p className="text-sm text-red-800 dark:text-red-200">
              {summary.errorMessage || "An unknown error occurred"}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {summary.title || "Video Summary"}
        </h2>
        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
          {summary.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(summary.duration)}
            </span>
          )}
          <span>
            Created {new Date(summary.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Video Player */}
      {summary.youtubeVideoId && (
        <div className="overflow-hidden rounded-xl border shadow-sm">
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${summary.youtubeVideoId}`}
              title={summary.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Status Display (Processing/Failed) */}
      {getStatusDisplay()}

      {/* Summary (only show when completed) */}
      {summary.status === "completed" && summary.summary && (
        <div className="rounded-xl border bg-white p-6 dark:bg-neutral-950">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">Summary</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {summary.summary}
            </p>
          </div>
        </div>
      )}

      {/* Transcript (collapsible, only show when completed) */}
      {summary.status === "completed" && summary.transcript && (
        <details className="group rounded-xl border bg-white p-6 dark:bg-neutral-950">
          <summary className="cursor-pointer text-lg font-semibold tracking-tight">
            Transcript
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              (Click to expand)
            </span>
          </summary>
          <div className="prose dark:prose-invert mt-4 max-w-none">
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {summary.transcript}
            </p>
          </div>
        </details>
      )}

      {/* Q&A Chat (only show when completed) */}
      {summary.status === "completed" && (
        <VideoChat videoSummaryId={summary.id} initialQuestions={questions} />
      )}
    </div>
  );
}
