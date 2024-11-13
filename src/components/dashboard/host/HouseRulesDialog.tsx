import { Checkbox } from "@/components/ui/checkbox";
import DialogCancelSave from "./DialogCancelSave";
import { Textarea } from "@/components/ui/textarea";

export default function HouseRulesDialog() {
  const rules = [
    {
      id: "0",
      description: "No smoking",
    },
    {
      id: "1",
      description: "No pets",
    },
    {
      id: "2",
      description: "No parties or events",
    },
    {
      id: "3",
      description: "Quiet hours",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">House Rules</h1>
        <p className="text-muted-foreground">
          What are the rules of your property?
        </p>
      </div>
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div className="flex items-center gap-x-2" key={index}>
            <Checkbox id={rule.id} />
            <label htmlFor={rule.id} className="font-semibold">
              {rule.description}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h2 className="font-semibold">Additional rules</h2>
        <Textarea placeholder="Add any additional house rules..." />
      </div>
      <p className="text-muted-foreground">
        Available throughout the booking process
      </p>
      <DialogCancelSave />
    </div>
  );
}
