import Link from "next/link";
import {
  FileText,
  Clock,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { VideoSummary } from "@/validations/video";

interface VideoCardProps {
  summary: VideoSummary;
}

export function VideoCard({ summary }: VideoCardProps) {
  const getStatusBadge = () => {
    switch (summary.status) {
      case "processing":
        return (
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-200">
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950 dark:text-red-200">
            <AlertCircle className="h-3 w-3" />
            Failed
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getSummaryExcerpt = () => {
    if (!summary.summary) return "Processing video summary...";
    return summary.summary.length > 150
      ? summary.summary.substring(0, 150) + "..."
      : summary.summary;
  };

  const cardContent = (
    <div className="group relative rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-neutral-950">
      <div className="mb-4 flex items-start justify-between">
        {summary.thumbnail ? (
          <img
            src={summary.thumbnail}
            alt={summary.title || "Video thumbnail"}
            className="h-16 w-24 rounded-lg object-cover"
          />
        ) : (
          <div className="bg-primary/10 text-primary flex h-16 w-24 items-center justify-center rounded-lg">
            <FileText className="h-8 w-8" />
          </div>
        )}
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <h3 className="mb-2 leading-none font-semibold tracking-tight">
        {summary.title || "Untitled Video"}
      </h3>

      <p className="text-muted-foreground mb-4 text-sm">
        {getSummaryExcerpt()}
      </p>

      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          <span>{formatDate(summary.createdAt)}</span>
        </div>
        {summary.duration && (
          <span>{Math.floor(summary.duration / 60)} mins</span>
        )}
      </div>
    </div>
  );

  if (summary.status === "processing" || summary.status === "failed") {
    return cardContent;
  }

  return <Link href={`/dashboard/summaries/${summary.id}`}>{cardContent}</Link>;
}
