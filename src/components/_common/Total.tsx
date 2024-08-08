import { CounterInput } from "./CounterInput";

export function Total({
  name,
  total,
  setTotal,
}: {
  name: string;
  total: number;
  setTotal: (total: number) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between">
      <p className="text-sm font-semibold">{name}</p>
      <CounterInput value={total} onChange={setTotal} />
    </div>
  );
}
