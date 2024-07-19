/**
 * an rhf-compatible input for a "toggle group", or a list of things that can each be toggled on or off, and the value is an array of the things that are toggled on.
 */
export function ToggleGroupInput<T extends string>({
  options,
  value = [],
  onChange,
  renderToggleBtn: ToggleBtn,
  renderToggleBtns: ToggleBtns,
}: {
  options: readonly T[];
  value?: NoInfer<T[]>;
  onChange: (option: T[]) => void;
  renderToggleBtn: React.FC<{
    option: T;
    selected: boolean;
    onClick: () => void;
  }>;
  renderToggleBtns: React.FC<{
    toggleBtns: React.ReactNode[];
  }>;
}) {
  function toggle(v: T) {
    if (value.includes(v)) {
      onChange(value.filter((w) => w !== v));
    } else {
      onChange([...value, v]);
    }
  }

  return (
    <ToggleBtns
      toggleBtns={options.map((v) => (
        <ToggleBtn
          key={v}
          option={v}
          selected={value.includes(v)}
          onClick={() => toggle(v)}
        />
      ))}
    />
  );
}
