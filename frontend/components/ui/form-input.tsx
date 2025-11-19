interface FormInputProps {
  id: string;
  name?: string;
  type?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function FormInput({
  id,
  name,
  type = "text",
  label,
  placeholder,
  required = false,
  autoComplete,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name || id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/10 w-full rounded-xl border-2 px-4 py-3.5 shadow-sm transition-all focus:ring-4 focus:outline-none"
      />
    </div>
  );
}
