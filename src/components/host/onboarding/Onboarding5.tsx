import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function Onboarding4() {
  return (
    <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <div className="mt-10 flex flex-col gap-10">
        <h1 className="text-4xl font-bold">
          How will your guest check-in / out?
        </h1>

        <div className="flex flex-col gap-5">
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2 rounded-lg border p-5">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="self">
                <h2 className="mb-2 text-lg font-bold">Self check-in / out</h2>
                <p className="text-muted-foreground">
                  Guests can check in and out by themselves
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-5">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="meet">
                <h2 className="text-lg font-bold">Meet host at door</h2>
                <p className="text-muted-foreground">
                  Guests get the keys from you when they arrive at the property
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-5">
              <RadioGroupItem value="other" id="option-two" />
              <Label htmlFor="option-two" className="text-lg font-bold">
                Other
              </Label>
            </div>
          </RadioGroup>

          <div>
            <p className="mb-2 text-sm font-semibold">
              Other: please specify here
            </p>
            <Input type="text" />
            {/* //TODO display the character count */}
          </div>
        </div>

        <div className="mt-5 w-full">
          <h1 className="mb-2 text-xl font-bold">Hours</h1>
          <div className="grid grid-cols-2 gap-5">
            <Input type="clock" placeholder="Check in time" className="p-5" />
            <Input type="clock" placeholder="Check out time" className="p-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
