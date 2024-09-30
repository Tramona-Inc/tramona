import CardSelect from "@/components/_common/CardSelect";
import Alternative from "@/components/_icons/Alternative";
import ApartmentIcon from "@/components/_icons/Apartment";
import Home from "@/components/_icons/Home";
import Hotels from "@/components/_icons/Hotels";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ALL_PROPERTY_TYPES } from "@/server/db/schema";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "../../host/onboarding/OnboardingFooter";
import SaveAndExit from "../../host/onboarding/SaveAndExit";
import { useState } from "react";
import { cn } from "@/utils/utils";

export const options = [
  {
    id: "Apartment",
    icon: <ApartmentIcon />,
    title: "Apartment",
    text: "A specific and discrete space that is available for guests to rent",
  },
  {
    id: "House",
    icon: <Home />,
    title: "Home",
    text: "Furnished and self-catering accommodations where guests rent the entire home",
  },
  {
    id: "Hotel",
    icon: <Hotels />,
    title: "Hotels, B&Bs, & More",
    text: "Hotel or traditional bed and breakfast",
  },
  {
    id: "Other",
    icon: <Alternative />,
    title: "Alternative Places",
    text: "If your property doesn't fit into any of the above categories, choose this option",
  },
] as const;

// ! Honeslty didn't need to do a form

const formSchema = z.object({
  propertyType: z.enum(ALL_PROPERTY_TYPES),
});

type FormValues = z.infer<typeof formSchema>;

export default function CohostOnboarding2({ editing = false }) {
  const propertyType = useHostOnboarding((state) => state.listing.propertyType);
  const setPropertyType = useHostOnboarding((state) => state.setPropertyType);
  const [error, setError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function handleFormSubmit() {
    setPropertyType(form.getValues("propertyType"));
  }

  function handleError() {
    setError(true);
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <h1
          className={`text-4xl font-bold ${cn(editing && "text-center text-xl")}`}
        >
          Which of these describes your property?
        </h1>
        {error && <p className="text-red-500">Please select a property type</p>}

        <Form {...form}>
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <div className="mb-5 flex flex-col gap-5">
                  {options.map((item) => (
                    <CardSelect
                      key={item.title}
                      title={item.title}
                      text={item.text}
                      onClick={() => setPropertyType(item.id)}
                      isSelected={propertyType === item.id}
                    >
                      {item.icon}
                    </CardSelect>
                  ))}
                </div>
              </FormItem>
            )}
          />
        </Form>
      </div>
      {!editing && (
        <OnboardingFooter
          handleNext={form.handleSubmit(handleFormSubmit)}
          isFormValid={true}
          isForm={true}
          handleError={handleError}
        />
      )}
    </>
  );
}
