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
            className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6"
            placeholder="Steet address"
          />
          <InputTogether
            className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
            placeholder="Apt, suite, unit (if applicable)"
          />
          <InputTogether
            className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
            placeholder="City / town"
          />
          <InputTogether
            className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
            placeholder="State / territory"
          />
          <InputTogether
            className="rounded-t-lg border-x-0 border-b-0 border-t-0 p-6 focus:rounded-b-lg focus:rounded-t-none"
            placeholder="ZIP code"
          />
        </div>
      </div>
    </div>
  );
}
