"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { submitQuestion } from "@/app/actions/video";
import { QuestionFormState, VideoQuestion } from "@/validations/video";
import { Loader2, Send } from "lucide-react";

interface VideoChatProps {
  videoSummaryId: number;
  initialQuestions: VideoQuestion[];
}

const INITIAL_STATE: QuestionFormState = {
  success: false,
  message: "",
  strapiError: null,
  isLoading: false,
  zodError: null,
  data: {},
  answer: null,
};

export function VideoChat({
  videoSummaryId,
  initialQuestions,
}: VideoChatProps) {
  const [questions, setQuestions] = useState<VideoQuestion[]>(initialQuestions);
  const [formState, formAction] = useActionState(submitQuestion, INITIAL_STATE);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  // Handle successful question submission
  useEffect(() => {
    if (formState.success && formState.answer) {
      // Add the new Q&A to the list
      const newQuestion: VideoQuestion = {
        id: Date.now(), // Temporary ID
        question: formState.data.question || "",
        answer: formState.answer,
        createdAt: new Date().toISOString(),
      };
      setQuestions((prev) => [...prev, newQuestion]);

      // Reset form
      formRef.current?.reset();
    }
  }, [formState.success, formState.answer, formState.data.question]);

  return (
    <div className="rounded-xl border bg-white p-6 dark:bg-neutral-950">
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight">Ask Questions</h3>
        <p className="text-muted-foreground text-sm">
          Chat with AI about this video
        </p>
      </div>

      {/* Chat history */}
      <div className="mb-4 max-h-[400px] space-y-4 overflow-y-auto rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900">
        {questions.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No questions yet. Ask something about this video!
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="space-y-2">
              {/* User question */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground max-w-[80%] rounded-lg rounded-tr-none px-4 py-2">
                  <p className="text-sm">{q.question}</p>
                </div>
              </div>
              {/* AI answer */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg rounded-tl-none bg-white px-4 py-2 shadow-sm dark:bg-neutral-800">
                  <p className="text-sm">{q.answer}</p>
                </div>
              </div>
            </div>
          ))
        )}
        {formState.isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg rounded-tl-none bg-white px-4 py-2 shadow-sm dark:bg-neutral-800">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {formState.strapiError && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {formState.strapiError}
        </div>
      )}

      {formState.zodError?.question && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {formState.zodError.question[0]}
        </div>
      )}

      {/* Question input form */}
      <form ref={formRef} action={formAction} className="flex gap-2">
        <input type="hidden" name="videoSummaryId" value={videoSummaryId} />
        <textarea
          name="question"
          rows={2}
          placeholder="Ask a question about this video..."
          disabled={formState.isLoading}
          className="focus:ring-primary flex-1 resize-none rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={formState.isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center self-end rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {formState.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
}
