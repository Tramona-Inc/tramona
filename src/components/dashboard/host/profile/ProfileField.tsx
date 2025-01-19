interface ProfileFieldProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  value?: string | boolean;
  onClick?: () => void;
}

export function ProfileField({
  icon: Icon,
  label,
  value,
  onClick,
}: ProfileFieldProps) {
  return (
    <button
      className="flex w-full items-start gap-3 border-b-2 p-4 text-left transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <Icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm">
          {value || "Add " + label.toLowerCase()}
        </p>
      </div>
    </button>
  );
}
