"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { processVideo } from "@/app/actions/video";
import { VideoFormState } from "@/validations/video";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";

const INITIAL_STATE: VideoFormState = {
  success: false,
  message: "",
  strapiError: null,
  isLoading: false,
  zodError: null,
  data: {},
  videoSummary: null,
};

export function VideoSubmitForm() {
  const router = useRouter();
  const [formState, formAction] = useActionState(processVideo, INITIAL_STATE);

  useEffect(() => {
    if (formState.success && formState.videoSummary) {
      // Redirect to the summary page
      router.push(`/dashboard/summaries/${formState.videoSummary.id}`);
    }
  }, [formState.success, formState.videoSummary, router]);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-950">
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight">
          Summarize a YouTube Video
        </h3>
        <p className="text-muted-foreground text-sm">
          Paste a YouTube URL to get an AI-generated summary and transcript
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            type="text"
            defaultValue="https://www.youtube.com/watch?v=CCb8Z-M6TL0" // TODO change to  defaultValue="{formState.data.youtubeUrl}"
          />
          <FormError error={formState.zodError?.youtubeUrl} />
        </div>

        {formState.strapiError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {formState.strapiError}
          </div>
        )}

        {formState.success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
            {formState.message}
          </div>
        )}

        <SubmitButton
          isLoading={formState.isLoading}
          loadingText="Processing..."
        >
          Process Video
        </SubmitButton>
      </form>
    </div>
  );
}
