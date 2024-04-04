import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function Onboarding4() {
  return (
    <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <div className="mt-10 flex flex-col gap-5">
        <h1 className="text-4xl font-bold">
          How will your guest check-in / out?
        </h1>

        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2 rounded-lg border p-5">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">
              <h2 className="mb-2 text-lg font-bold">Self check-in / out</h2>
              <p className="text-muted-foreground">
                Guests can check in and out by themselves
              </p>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border p-5">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two">
              <h2 className="text-lg font-bold">Meet host at door</h2>
              <p className="text-muted-foreground">
                Guests get the keys from you when they arrive at the property
              </p>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border p-5">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two" className="text-lg font-bold">
              Other
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-5">
          <p className="text-sm font-semibold">Other: please specify here</p>
          <Input type="text" />
        </div>

        <div className="mt-5 w-full">
          <h1 className="text-xl font-bold">Hours</h1>
          <div className="grid grid-cols-2 gap-5">
            <Input type="clock" placeholder="Check in time" />
            <Input type="clock" placeholder="Check out time" />
          </div>
        </div>
      </div>
    </div>
  );
}
