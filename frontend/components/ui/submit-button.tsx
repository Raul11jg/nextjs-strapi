interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function SubmitButton({
  isLoading,
  loadingText = "Loading...",
  children,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="from-primary to-primary/90 text-primary-foreground shadow-primary/25 hover:shadow-primary/30 w-full rounded-xl bg-linear-to-r px-6 py-4 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
