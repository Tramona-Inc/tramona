export function ViewProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.FC<{ className: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex w-full items-start gap-3 border-b-2 p-4 text-left transition-colors hover:bg-muted">
      <Icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        {typeof value === "boolean" ? (
          <p>Show decade I born</p>
        ) : (
          <p className="mt-0.5 truncate text-sm">
            {value || "Add " + label.toLowerCase()}
          </p>
        )}
      </div>
    </div>
  );
}
