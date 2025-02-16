import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import { useHostTeamStore } from "@/utils/store/hostTeamStore"
import { toast } from "@/components/ui/use-toast"
import { errorToast } from "@/utils/toasts"
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown"

export default function AgeRestrictionSection({
  ageRestriction,
  propertyId,
}: {
  ageRestriction: number | null
  propertyId: number
}) {
  const { currentHostTeamId } = useHostTeamStore()
  const { mutateAsync: updateProperty } = api.properties.update.useMutation()

  const [open, setOpen] = useState(false)
  const [age, setAge] = useState<number | null>(ageRestriction)

  const handleSave = async () => {
    try {
      await updateProperty({
        updatedProperty: { id: propertyId, ageRestriction: age },
        currentHostTeamId: currentHostTeamId!,
      })
      toast({ title: "Property Updated!" })
    } catch (error) {
      errorToast()
    }
  }

  return (
    <div className="rounded-lg border">
      <CalendarSettingsDropdown title="Age Restriction" description="Set the minimum age requirement for guests to make booking requests." open={open} setOpen={setOpen} />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-base font-semibold">
                Minimum age required to send request
              </Label>
              <p className="text-sm text-muted-foreground">
                Set the minimum age requirement for guests to make booking requests.
              </p>
              <Input
                id="age"
                type="number"
                value={age ?? ""}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
                className="max-w-[120px]"
                min={0}
                max={100}
                placeholder="Enter age"
              />
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

