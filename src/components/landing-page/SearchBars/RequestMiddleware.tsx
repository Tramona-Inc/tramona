import React, { createContext, useContext, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";

const FormContext = createContext();

export const useFormMiddleware = () => useContext(FormContext);

export const FormMiddlewareProvider = ({ children }) => {
  const [scrapedData, setScrapedData] = useState(null);
  const methods = useFormContext();
  const { refetch: refetchScrape } = api.misc.scrapeUsingLink.useQuery(
    { url: methods.getValues("airbnbLink") },
    { enabled: false },
  );

  const handleSubmit = async (data, onSubmit) => {
    const airbnbLink = data.airbnbLink;
    if (airbnbLink) {
      try {
        const result = await refetchScrape();
        if (result.data && !(result instanceof TRPCError)) {
          const { nightlyPrice, propertyName, checkIn, checkOut, numGuests } =
            result.data;
          methods.setValue("location", propertyName);
          methods.setValue("date", { from: checkIn, to: checkOut });
          methods.setValue("numGuests", numGuests);
          methods.setValue("maxNightlyPriceUSD", nightlyPrice);
          setScrapedData(result.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Be sure it is a valid Airbnb property link.",
          description: error.message || "An error occurred please try again.",
        });
        return;
      }
    }
    onSubmit(data); // Call the original onSubmit function with the form data
  };

  return (
    <FormContext.Provider value={{ handleSubmit, scrapedData }}>
      {children}
    </FormContext.Provider>
  );
};
