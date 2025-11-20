import { cookies } from "next/headers";
import { STRAPI_BASE_URL } from "@/lib/strapi";
import { VideoSubmitForm } from "@/components/dashboard/video-submit-form";
import { VideoCard } from "@/components/dashboard/video-card";
import type { VideoSummary } from "@/validations/video";
import { Plus } from "lucide-react";

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
      cache: "no-store", // Don't cache to get real-time status updates
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

export default async function DashboardPage() {
  const videos = await getUserVideos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Your video summaries and insights
          </p>
        </div>
      </div>

      <VideoSubmitForm />

      {videos.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-white p-12 text-center dark:bg-neutral-950">
          <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No summaries yet</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-sm">
            Get started by pasting a YouTube URL above to create your first
            AI-powered video summary.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="mb-4 text-lg font-semibold tracking-tight">
            Recent Summaries
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} summary={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
