// an rhf-compatible input for a "toggle group", or a list of things that can each be toggled on or off, and the value is the subset of the things that are toggled on
export function ToggleGroupInput<T extends string>({
  options,
  value = [],
  onChange,
  renderButton,
  renderButtons,
}: {
  options: readonly T[];
  value?: NoInfer<T[]>;
  onChange: (option: T[]) => void;
  renderButton: React.FC<{ option: T; selected: boolean; onClick: () => void }>;
  renderButtons: React.FC<{ buttons: React.ReactNode[] }>;
}) {
  function toggle(v: T) {
    if (value.includes(v)) {
      onChange(value.filter((w) => w !== v));
    } else {
      onChange([...value, v]);
    }
  }

  return renderButtons({
    buttons: options.map((v) =>
      renderButton({
        option: v,
        selected: value.includes(v),
        onClick: () => toggle(v),
      }),
    ),
  });
}
