import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function CheckOutDialog() {
  const instructions = [
    {
      id: "0",
      description: "Gather used towels",
    },
    {
      id: "1",
      description: "Throw trash away",
    },
    {
      id: "2",
      description: "Turn things off",
    },
    {
      id: "3",
      description: "Lock up",
    },
    {
      id: "4",
      description: "Return keys",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Check out instructions</h1>
        <p className="text-muted-foreground">
          What should travelers do before they check out?
        </p>
      </div>
      <div className="space-y-4">
        {instructions.map((instruction, index) => (
          <div className="flex items-center gap-x-2" key={index}>
            <Checkbox id={instruction.id} />
            <label htmlFor={instruction.id} className="font-semibold">
              {instruction.description}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h2 className="font-semibold">Additional check-out details</h2>
        <Input placeholder="Add any additional checkout instructions..." />
      </div>
      <p className="text-muted-foreground">
        Shared at 9 PM the evening before checkout
      </p>
    </div>
  );
}
