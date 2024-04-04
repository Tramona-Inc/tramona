import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { errorToast, successfulAdminOfferToast } from "@/utils/toasts";
import { capitalize, getNumNights, plural } from "@/utils/utils";
import { Textarea } from "../ui/textarea";
import {
  optional,
  zodInteger,
  zodNumber,
  zodString,
  zodUrl,
} from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import TagSelect from "../_common/TagSelect";
import { type OfferWithProperty } from "../requests/[id]/OfferCard";
import { useSession } from "next-auth/react";
import ErrorMsg from "../ui/ErrorMsg";
import axios from "axios";
import {
  ALL_PROPERTY_AMENITIES,
  ALL_PROPERTY_SAFETY_ITEMS,
  ALL_PROPERTY_STANDOUT_AMENITIES,
  ALL_PROPERTY_TYPES,
  type Request,
} from "@/server/db/schema";

const calculatePriceOptions = (oldPrice: number): number[] => {
  if (oldPrice >= 0 && oldPrice < 400) {
    return [50, 75, 100];
  } else if (oldPrice >= 400 && oldPrice < 650) {
    return [75, 100, 150];
  } else if (oldPrice >= 650 && oldPrice < 900) {
    return [100, 150, 200];
  } else if (oldPrice >= 900) {
    return [200, 225, 250];
  }
  return [50, 75, 100];
};

const formSchema = z.object({
  preferences: zodString({ maxLen: Infinity }),
  price: zodNumber(),
  propertyLinks: z.object({ value: optional(zodUrl()) }).array(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function RequestRefreshForm({
  afterSubmit,
  request,
}: {
  afterSubmit?: () => void;
  request: Request;
}) {
  const { data: session } = useSession();
  const updateRequest = api.requests.updateRequest.useMutation();
  const {
    data: checkResult,
    isLoading,
    isError,
  } = api.requests.checkRequestUpdate.useQuery(
    {
      requestId: request.id,
    },
    {
      enabled: !!request.id,
    },
  );

  const numberOfNights = getNumNights(request.checkIn, request.checkOut);
  const old_price = request
    ? Math.round(request.maxTotalPrice / numberOfNights / 100)
    : 1;

  const priceOptions: number[] = calculatePriceOptions(old_price);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyLinks: [{ value: "" }],
      price: 0,
    },
  });

  const imageUrlInputs = useFieldArray({
    name: "propertyLinks",
    control: form.control,
  });

  const { watch } = form;

  const onSubmit = async (data: FormSchema) => {
    let submissionData = {
      preferences: data.preferences,
      updatedPriceNightlyUSD: data.price * 100,
      propertyLinks: data.propertyLinks
        .map((urlObj) => urlObj.value)
        .filter((url): url is string => !!url),
    };

    await updateRequest.mutateAsync({
      requestId: request.id,
      updatedRequestInfo: submissionData,
    });

    afterSubmit?.();
  };

  const [currentStep, setCurrentStep] = useState(0);
  const nextStep = async () => {
    let isValid = false;
    switch (currentStep) {
      case 0:
        isValid = await form.trigger("price");
        break;
      case 1:
        isValid = await form.trigger("preferences");
        break;
      case 2:
        isValid = true;
        break;
    }
    if (isValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
    }
  };

  const prevStep = () =>
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h3 className="text-lg font-semibold">Refreshing your request</h3>
            <div className="m-2 flex items-center">
              <div className="mb-4 flex h-6 w-12 items-center justify-center rounded-full bg-black text-xs text-white md:h-4 md:w-5">
                1
              </div>
              <span className="ml-4 text-base leading-5">
                In order to get more offers for your request, you need to update
                your request price.
              </span>
            </div>
            <span className="text-gray-500">
              We recommend that you update the price by
            </span>
            <div className="my-2 flex w-full justify-center space-x-2">
              {priceOptions.map((price: number) => (
                <button
                  className={`w-full gap-x-4 rounded-lg border px-8 py-2 text-sm ${form.watch("price").toString() === price.toString() ? "border-blue-500 bg-blue-100" : "border-gray-400"}`}
                  key={price}
                  type="button"
                  onClick={() =>
                    form.setValue("price", price, { shouldValidate: true })
                  }
                >
                  ${price}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="my-2 flex w-5/6 items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-neutral-900">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter custom price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      inputMode="decimal"
                      prefix="$"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="m-2 flex items-center">
              <div className="mb-10 flex h-6 w-20 items-center justify-center rounded-full bg-black text-xs text-white md:mb-4 md:h-4 md:w-8">
                2
              </div>
              <span className="ml-4 text-base leading-5">
                Please enter your preferences on what you are looking for in
                your new offers or tell us what you didn&apos;t like about your
                other offers.
              </span>
            </div>
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormControl>
                    <Textarea {...field} className="resize-y" rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 2:
        return (
          <FormItem className="col-span-full space-y-1">
            <div className="m-2 flex items-center">
              <div className="mb-8 flex h-6 w-20 items-center justify-center rounded-full bg-black text-xs text-white md:mb-4 md:h-4 md:w-8">
                3
              </div>
              <span className="ml-4 text-base leading-5">
                Are you currently eyeing any properties on Airbnb/Vrbo? Enter
                the link below and we will try to get you that exact stay at a
                discount!
              </span>
            </div>

            <FormLabel></FormLabel>
            <div className="space-y-2 p-2">
              {imageUrlInputs.fields.map((field, index) => (
                <div key={field.id} className="relative">
                  <FormField
                    control={form.control}
                    name={`propertyLinks.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="url"
                            placeholder={`URL ${index + 1}`}
                            className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${
                              index !== 0 ? "pr-16" : ""
                            }`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => imageUrlInputs.remove(index)}
                      className="absolute right-2 top-2 pt-0.5 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {imageUrlInputs.fields.length < 5 && (
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => imageUrlInputs.append({ value: "" })}
                >
                  + Add additional
                </button>
              )}
            </div>
          </FormItem>
        );

      case 3:
        return (
          <div className="border-grey-500 mx-auto max-w-xl rounded-lg border bg-white px-4 py-2 sm:p-4">
            <h3 className="mb-2 text-center text-lg font-semibold sm:mb-4 sm:text-xl">
              Review Your Details
            </h3>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <strong>Price Preference Updated To:</strong>
                <span className="mt-1 text-gray-600 sm:mt-0">
                  ${watch("price") + old_price} per night
                </span>
              </div>
              {watch("preferences") && (
                <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <strong>Your Additional Preferences:</strong>
                  <p
                    className="mt-1 truncate text-gray-600 sm:mt-0 sm:max-w-xs"
                    title={watch("preferences")}
                  >
                    {watch("preferences").length > 50
                      ? watch("preferences").substring(0, 47) + "..."
                      : watch("preferences")}
                  </p>
                </div>
              )}
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <strong>Links:</strong>
                <span className="mt-1 text-gray-600 sm:mt-0">
                  {watch("propertyLinks").some(
                    (url) => url.value?.trim() !== "",
                  )
                    ? "Provided"
                    : "None Provided"}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (checkResult?.alreadyUpdated) {
    return (
      <>
        <h1 className="text-center text-lg font-semibold">Thank you! </h1>
        <hr className="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
        <div className="my-10">
          <div className="p-18">
            <p>
              You've already updated your request. We'll get back to you
              shortly.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Form {...form}>
        <div>
          {currentStep > 0 && (
            <div>
              <button
                onClick={prevStep}
                className="flex items-center gap-x-2 py-2 text-sm text-gray-700 sm:w-auto"
              >
                <svg
                  className="h-4 w-4 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 16"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 1L2 8L9 15"
                  />
                </svg>
                <span>Go back</span>
              </button>
              <hr className="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
            </div>
          )}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {renderStep()}

          <div className="mt-16 flex justify-center">
            {currentStep < 3 && (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            )}
            {currentStep === 3 && <Button type="submit">Submit</Button>}
          </div>
        </form>

        <div className="mt-4 flex justify-center space-x-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${currentStep === index ? "bg-black" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </Form>
    </>
  );
}
