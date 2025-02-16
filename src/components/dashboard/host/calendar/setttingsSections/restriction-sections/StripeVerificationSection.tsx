"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { api } from "@/utils/api"
import { useHostTeamStore } from "@/utils/store/hostTeamStore"
import { toast } from "@/components/ui/use-toast"
import { errorToast } from "@/utils/toasts"
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown"
import type { Property } from "@/server/db/schema"

export default function StripeVerificationSection({
  stripeVerRequired,
  property,
}: {
  stripeVerRequired: boolean
  property: Property
}) {
  const { currentHostTeamId } = useHostTeamStore()
  const { mutateAsync: updateProperty } = api.properties.update.useMutation()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(stripeVerRequired ? "yes" : "no")

  const handleSave = async () => {
    try {
      await updateProperty({
        updatedProperty: { ...property, stripeVerRequired: value === "yes" },
        currentHostTeamId: currentHostTeamId!,
      })
      toast({ title: "Property Updated!" })
    } catch (error) {
      errorToast()
    }
  }

  return (
    <div className="rounded-lg border">
      <CalendarSettingsDropdown title="Stripe Verification" description="Require the user to be Stripe-verified." open={open} setOpen={setOpen} />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-base font-semibold">Require the user to be Stripe-verified</Label>
              <p className="text-sm text-muted-foreground">
                Only allow booking requests from users who have completed Stripe verification.
              </p>
              <RadioGroup value={value} onValueChange={setValue} className="flex flex-col space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="r1" />
                  <Label htmlFor="r1" className="text-sm font-medium">
                    No
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="r2" />
                  <Label htmlFor="r2" className="text-sm font-medium">
                    Yes
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

