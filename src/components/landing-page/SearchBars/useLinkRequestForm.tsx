import { useZodForm } from "@/utils/useZodForm";
import { linkRequestSchema } from "./schemas";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { type LinkConfirmationProps } from "./LinkConfirmation";
import { LINK_REQUEST_DISCOUNT_PERCENTAGE } from "@/utils/constants";
import { table } from "console";

export type LinkRequestData = Pick<
  LinkConfirmationProps,
  "property" | "request"
> & {
  originalPrice: number;
};

export function useLinkRequestForm({
  afterSubmit,
  setData,
}: {
  setData: (data?: LinkRequestData) => void;
  afterSubmit?: () => void;
}) {
  const form = useZodForm({ schema: linkRequestSchema, mode: "onChange" });

  const utils = api.useUtils();
  //https://www.airbnb.com/slink/6z0VwdPd
  const onSubmit = form.handleSubmit(async ({ url }) => {
    //expand url if it came from the mobile application
    if (url.startsWith("https://www.airbnb.com/slink")) {
      const expandedRes = await Airbnb.expandUrl(url);
      if (!expandedRes) {
        form.setError("url", {
          message: "Please input a valid Airbnb Link",
        });
        return;
      } else {
        url = expandedRes;
      }
    }

    const { checkIn, checkOut, numGuests } = Airbnb.parseUrlParams(url);
    if (!checkIn || !checkOut) {
      form.setError("url", {
        message: "Please input check-in/out on Airbnb and try again",
      });
      return;
    }

    if (!numGuests) {
      form.setError("url", {
        message: "Please input number of guests on Airbnb and try again",
      });
      return;
    }

    setData(undefined);

    await utils.misc.scrapeAirbnbLink
      .fetch({ url, params: { checkIn, checkOut, numGuests } })
      .then(({ status, data }) => {
        switch (status) {
          case "failed to scrape":
            form.setError("url", {
              message: "Couldn't extract property data, please try again",
            });
            break;
          case "failed to extract city":
            form.setError("url", {
              message: "Couldn't extract city name, please try again",
            });
            break;
          case "failed to parse url":
            form.setError("url", {
              message:
                "Please check that you pasted the full URL and try again",
            });
            break;
          case "failed to parse title":
            form.setError("url", {
              message: "Couldn't parse title, please try again",
            });
            break;
          case "success":
            setData({
              property: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                url: url,
                listingSite: "Airbnb",
              },
              request: {
                location: data.location,
                maxTotalPrice: Math.round(
                  data.price * (1 - LINK_REQUEST_DISCOUNT_PERCENTAGE / 100),
                ),
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                numGuests,
              },
              originalPrice: data.price,
            });

            form.reset();
            afterSubmit?.();

            break;
        }
      })
      .catch((e) => {
        console.error(e);
        errorToast();
        form.reset();
        setTimeout(() => form.setFocus("url"), 0); // idk why you have to do this but ya
      });
  });

  return {
    form,
    onSubmit,
  };
}

export type LinkRequestForm = ReturnType<typeof useLinkRequestForm>["form"];
