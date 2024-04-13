import CardSelect from "@/components/_common/CardSelect";
import Alternative from "@/components/_icons/Alternative";
import ApartmentIcon from "@/components/_icons/Apartment";
import Home from "@/components/_icons/Home";
import Hotels from "@/components/_icons/Hotels";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ALL_PROPERTY_TYPES } from "@/server/db/schema";
import {
  type PropertyType,
  useHostOnboarding,
} from "@/utils/store/host-onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { useState } from "react";

const options = [
  {
    id: "Apartment" as PropertyType,
    icon: <ApartmentIcon />,
    title: "Apartment",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
  {
    id: "Home" as PropertyType,
    icon: <Home />,
    title: "Home",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
  {
    id: "Hotels" as PropertyType,
    icon: <Hotels />,
    title: "Hotels, B&Bs, & More",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
  {
    id: "Alternative" as PropertyType,
    icon: <Alternative />,
    title: "Alternative Places",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
];

// ! Honeslty didn't need to do a form

const formSchema = z.object({
  propertyType: z.enum(ALL_PROPERTY_TYPES),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding2() {
  const propertyType = useHostOnboarding((state) => state.listing.propertyType);
  const setPropertyType = useHostOnboarding((state) => state.setPropertyType);
  const [error, setError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "Other",
    },
  });

  async function handleFormSubmit() {
    if (form.getValues("propertyType") !== "Other") {
      setPropertyType(propertyType);
    }
  }

  function handleError() {
    setError(true);
  }

  return (
    <>
      <SaveAndExit />
      <div className="flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <h1 className="text-4xl font-bold">
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
                      hover={true}
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
      <OnboardingFooter
        handleNext={form.handleSubmit(handleFormSubmit)}
        isFormValid={propertyType !== "Other"}
        isForm={true}
        handleError={handleError}
      />
    </>
  );
}
