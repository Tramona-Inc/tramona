import { InputTogether } from "@/components/ui/input-together";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Onboarding4() {
  return (
    <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <div className="mt-10 flex flex-col gap-5">
        <h1 className="text-4xl font-bold">
          Where&apos;s your property located?
        </h1>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Country /region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">United States</SelectItem>
          </SelectContent>
        </Select>

        <div className="rounded-lg border">
          <InputTogether
            className="rounded-t-lg border-none"
            placeholder="Steet address"
          />
          <InputTogether
            className="border-none"
            placeholder="Apt, suite, unit (if applicable)"
          />
          <InputTogether className="border-none" placeholder="City / town" />
          <InputTogether
            className="border-none"
            placeholder="State / territory"
          />
          <InputTogether
            className="rounded-b-lg border-none"
            placeholder="ZIP code"
          />
        </div>
      </div>
    </div>
  );
}
