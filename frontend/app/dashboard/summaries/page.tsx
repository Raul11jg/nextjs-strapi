import { Suspense } from "react";
import { cookies } from "next/headers";
import { STRAPI_BASE_URL } from "@/lib/strapi";
import { VideoCard } from "@/components/dashboard/video-card";
import type { VideoSummary } from "@/validations/video";
import { Filter, SortDesc } from "lucide-react";

async function getUserVideos(): Promise<VideoSummary[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt")?.value;

    if (!token) {
      return [];
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/video-summaries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch videos");
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export default function SummariesPage() {
  return (
    <Suspense fallback={<SummariesFallback />}>
      <SummariesContent />
    </Suspense>
  );
}

async function SummariesContent() {
  const videos = await getUserVideos();

  const completedVideos = videos.filter((v) => v.status === "completed");
  const processingVideos = videos.filter((v) => v.status === "processing");
  const failedVideos = videos.filter((v) => v.status === "failed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Summaries</h2>
          <p className="text-muted-foreground">
            Manage and browse your video summaries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
            <SortDesc className="h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 dark:bg-neutral-950">
          <div className="text-muted-foreground text-sm font-medium">
            Completed
          </div>
          <div className="mt-2 text-2xl font-bold">
            {completedVideos.length}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 dark:bg-neutral-950">
          <div className="text-muted-foreground text-sm font-medium">
            Processing
          </div>
          <div className="mt-2 text-2xl font-bold">
            {processingVideos.length}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 dark:bg-neutral-950">
          <div className="text-muted-foreground text-sm font-medium">
            Failed
          </div>
          <div className="mt-2 text-2xl font-bold">{failedVideos.length}</div>
        </div>
      </div>

      {/* Processing Videos */}
      {processingVideos.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold tracking-tight">
            Currently Processing
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processingVideos.map((video) => (
              <VideoCard key={video.id} summary={video} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Videos */}
      {completedVideos.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold tracking-tight">
            Completed Summaries
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedVideos.map((video) => (
              <VideoCard key={video.id} summary={video} />
            ))}
          </div>
        </div>
      )}

      {/* Failed Videos */}
      {failedVideos.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold tracking-tight">
            Failed Processing
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {failedVideos.map((video) => (
              <VideoCard key={video.id} summary={video} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-white p-12 text-center dark:bg-neutral-950">
          <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Filter className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No summaries yet</h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            Go to the dashboard to create your first video summary.
          </p>
        </div>
      )}
    </div>
  );
}

function SummariesFallback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-6 w-48 animate-pulse rounded" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-20 animate-pulse rounded-lg border" />
          <div className="h-10 w-20 animate-pulse rounded-lg border" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-4 dark:bg-neutral-950"
          >
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted mt-4 h-8 w-12 animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-xl border bg-white dark:bg-neutral-950"
          />
        ))}
      </div>
    </div>
  );
}
