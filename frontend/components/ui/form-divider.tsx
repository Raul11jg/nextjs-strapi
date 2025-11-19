interface FormDividerProps {
  text?: string;
}

export default function FormDivider({ text = "or" }: FormDividerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="border-border w-full border-t"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background text-muted-foreground px-4">{text}</span>
      </div>
    </div>
  );
}
