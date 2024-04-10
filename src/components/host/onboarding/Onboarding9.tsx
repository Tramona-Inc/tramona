import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";

const formSchema = z.object({
  pets: z.string(),
  smoking: z.string(),
  additionalComments: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding9() {
  const petsAllowed = useHostOnboarding((state) => state.listing.petsAllowed);
  const smokingAllowed = useHostOnboarding(
    (state) => state.listing.smokingAllowed,
  );
  const otherHouseRules = useHostOnboarding(
    (state) => state.listing.otherHouseRules,
  );

  const setPetsAllowed = useHostOnboarding((state) => state.setPetsAllowed);
  const setSmokingAllowed = useHostOnboarding(
    (state) => state.setSmokingAllowed,
  );
  const setOtherHouseRules = useHostOnboarding(
    (state) => state.setOtherHouseRules,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pets: petsAllowed ? "true" : "false",
      smoking: smokingAllowed ? "true" : "false",
      additionalComments: otherHouseRules ?? undefined,
    },
  });

  async function handleFormSubmit(values: FormSchema) {
    setPetsAllowed(values.pets === "true" ? true : false);
    setSmokingAllowed(values.smoking === "true" ? true : false);
    setOtherHouseRules(values.additionalComments ?? "");
  }

  return (
    <>
      <div className="container my-10 flex flex-grow flex-col justify-center">
        <h1 className="mb-8 text-3xl font-bold">Any house rules?</h1>
        <Form {...form}>
          <div className="space-y-4">
            {/* TO DO: FIX */}
            <FormField
              control={form.control}
              name="pets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-primary">
                    Are pets allowed?
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center space-x-4">
                      <RadioGroup
                        className="flex flex-row gap-10"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="allowed">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="allowed">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smoking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-primary">
                    Is smoking allowed?
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center space-x-4">
                      <RadioGroup
                        className="flex flex-row gap-10"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="allowed">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="allowed">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-primary">
                    Anything you&apos;d like to add?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-y"
                      rows={10}
                      placeholder="Quiet time after 11 pm, no smoking"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
      <OnboardingFooter
        isForm={true}
        handleNext={form.handleSubmit(handleFormSubmit)}
        isFormValid={form.formState.isValid}
      />
    </>
  );
}
