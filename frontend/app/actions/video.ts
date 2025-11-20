"use server";

import {
  VideoFormState,
  VideoSubmitSchema,
  QuestionFormState,
  QuestionSchema,
} from "@/validations/video";
import { z } from "zod";
import { STRAPI_BASE_URL } from "@/lib/strapi";
import { cookies } from "next/headers";

/**
 * Server action to process a YouTube video
 */
export async function processVideo(
  prevState: VideoFormState,
  formData: FormData
): Promise<VideoFormState> {
  const fields = {
    youtubeUrl: (formData.get("youtubeUrl") as string) || "",
  };

  const validatedFields = VideoSubmitSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiError: null,
      isLoading: false,
      zodError: flattenedErrors.fieldErrors,
      data: fields,
      videoSummary: null,
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt")?.value;

    if (!token) {
      return {
        success: false,
        message: "Authentication required",
        strapiError: "Please sign in to process videos",
        isLoading: false,
        zodError: null,
        data: fields,
        videoSummary: null,
      };
    }

    const response = await fetch(
      `${STRAPI_BASE_URL}/api/video-summaries/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ youtubeUrl: fields.youtubeUrl }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to process video",
        strapiError: result.error?.message || "Unknown error occurred",
        isLoading: false,
        zodError: null,
        data: fields,
        videoSummary: null,
      };
    }

    return {
      success: true,
      message: result.message || "Video processing started",
      strapiError: null,
      isLoading: false,
      zodError: null,
      data: fields,
      videoSummary: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error",
      strapiError: "Failed to connect to server",
      isLoading: false,
      zodError: null,
      data: fields,
      videoSummary: null,
    };
  }
}

/**
 * Server action to submit a question
 */
export async function submitQuestion(
  prevState: QuestionFormState,
  formData: FormData
): Promise<QuestionFormState> {
  const fields = {
    question: (formData.get("question") as string) || "",
  };
  const videoSummaryId = formData.get("videoSummaryId") as string;

  const validatedFields = QuestionSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiError: null,
      isLoading: false,
      zodError: flattenedErrors.fieldErrors,
      data: fields,
      answer: null,
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt")?.value;

    if (!token) {
      return {
        success: false,
        message: "Authentication required",
        strapiError: "Please sign in to ask questions",
        isLoading: false,
        zodError: null,
        data: fields,
        answer: null,
      };
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/video-questions/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        videoSummaryId: parseInt(videoSummaryId),
        question: fields.question,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to get answer",
        strapiError: result.error?.message || "Unknown error occurred",
        isLoading: false,
        zodError: null,
        data: fields,
        answer: null,
      };
    }

    return {
      success: true,
      message: "Question answered successfully",
      strapiError: null,
      isLoading: false,
      zodError: null,
      data: { question: "" }, // Clear the question field
      answer: result.data.answer,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error",
      strapiError: "Failed to connect to server",
      isLoading: false,
      zodError: null,
      data: fields,
      answer: null,
    };
  }
}
