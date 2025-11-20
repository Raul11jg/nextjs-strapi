/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

// YouTube URL validation regex
const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;

export const VideoSubmitSchema = z.object({
  youtubeUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(YOUTUBE_URL_REGEX, "Please enter a valid YouTube URL"),
});

export const QuestionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(500, "Question must be less than 500 characters"),
});

export type VideoSubmitSchema = z.infer<typeof VideoSubmitSchema>;
export type QuestionSchema = z.infer<typeof QuestionSchema>;

// Form state types
export interface VideoFormState {
  success: boolean;
  message: string;
  strapiError: string | null;
  isLoading: boolean;
  zodError: any;
  data: {
    youtubeUrl?: string;
  };
  videoSummary?: VideoSummary | null;
}

export interface QuestionFormState {
  success: boolean;
  message: string;
  strapiError: string | null;
  isLoading: boolean;
  zodError: any;
  data: {
    question?: string;
  };
  answer?: string | null;
}

// Video summary types
export interface VideoSummary {
  id: number;
  youtubeUrl: string;
  youtubeVideoId: string;
  title: string | null;
  thumbnail: string | null;
  duration: number | null;
  transcript: string | null;
  summary: string | null;
  status: "processing" | "completed" | "failed";
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  videoQuestions?: VideoQuestion[];
}

export interface VideoQuestion {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}
