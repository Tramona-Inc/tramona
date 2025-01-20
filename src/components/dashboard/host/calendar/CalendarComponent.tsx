// CalendarComponent.tsx
"use client";

import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardBanner } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import MonthCalendar from "./MonthCalendar";
import CalendarSettings from "./CalendarSettings";
import { Property } from "@/server/db/schema/tables/properties";
import { eachDayOfInterval, format, isBefore, parseISO } from "date-fns";
import HostICalSync from "../HostICalSync";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import CalenderSettingsLoadingState from "./CalenderSettingsLoadingState";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server/api/root";

export default function CalendarComponent() {
  useSetInitialHostTeamId();
  const { currentHostTeamId } = useHostTeamStore();
  const router = useRouter();
  const { propertyId } = router.query;

  const [hasDismissedModal, setHasDismissedModal] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const {
    data: hostProperties,
    isLoading: loadingProperties,
    refetch,
  } = api.properties.getHostProperties.useQuery(
    { currentHostTeamId: currentHostTeamId! },
    {
      enabled: !!currentHostTeamId,
      refetchOnWindowFocus: false,
    },
  );

  //memoize initial property an host hostproperties
  // Update the ref value only when the properties change
  const hostPropertiesRef = useRef(hostProperties);

  useEffect(() => {
    hostPropertiesRef.current = hostProperties;
  }, [hostProperties]);

  const initialProperty = useMemo(() => {
    if (!hostPropertiesRef.current) {
      //sometimes the query no good
      void refetch();
    }
    return (
      hostPropertiesRef.current?.find(
        (property) => property.id === Number(propertyId),
      ) ??
      hostPropertiesRef.current?.[0] ??
      null
    );
  }, [propertyId]);

  // Set initial selected property when data loads
  useEffect(() => {
    setSelectedProperty(initialProperty);
  }, [initialProperty]);

  const queryInput = useMemo(() => {
    if (!selectedProperty?.hospitableListingId) return null; // Early return
    return {
      hospitableListingId: selectedProperty.hospitableListingId,
    };
  }, [selectedProperty?.hospitableListingId]);

  const { data: hospitableCalendarPrices, isLoading: loadingPrices } =
    api.calendar.getAndUpdateHostCalendar.useQuery(queryInput!, {
      enabled: Boolean(queryInput),
    });

  const [isBookItNowChecked, setIsBookItNowChecked] = useState<boolean>(
    () => selectedProperty?.bookItNowEnabled ?? false,
  );

  const prices = useMemo(() => {
    const priceMap: Record<string, number | undefined> = {};
    const daysInMonth = eachDayOfInterval({
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });

    daysInMonth.forEach((currentDate) => {
      const dateString = currentDate.toISOString().split("T")[0]!;
      const priceEvent = hospitableCalendarPrices?.find(
        (event) => event.date === dateString,
      );
      if (dateString) {
        priceMap[dateString] = priceEvent?.price.amount
          ? priceEvent.price.amount / 100
          : undefined;
      }
    });

    return priceMap;
  }, [date, hospitableCalendarPrices]);

  const reservedDates = hospitableCalendarPrices
    ?.filter((price) => price.availability.available === false)
    .map((price) => ({
      start: price.date,
      end: price.date,
      platformBookedOn: "airbnb" as const,
    }));

  const isDateReserved = useCallback(
    (date: string) => {
      const parsedDate = parseISO(date);

      const normalizedDate = format(parsedDate, "yyyy-MM-dd");

      if (isBefore(parsedDate, new Date())) {
        return true;
      }

      if (
        reservedDates?.some(
          (reservedDate) =>
            reservedDate.start <= normalizedDate &&
            reservedDate.end >= normalizedDate,
        )
      ) {
        return true;
      }

      return false;
    },
    [reservedDates],
  );

  const totalVacancies = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return eachDayOfInterval({ start: startOfMonth, end: endOfMonth }).filter(
      (day) => isBefore(today, day) && !isDateReserved(day.toISOString()),
    ).length;
  }, [date, isDateReserved]);

  const leftOnTheTable = useMemo(() => {
    return Object.entries(prices)
      .filter(([dateStr]) => !isDateReserved(dateStr))
      .reduce((sum, [_, price]) => (price ? sum + price : sum), 0);
  }, [prices, isDateReserved]);

  const changeMonth = (increment: number) => {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth() + increment,
      1,
    );
    setDate(newDate);
  };

  const [isCalendarUpdating, setIsCalendarUpdating] = useState(false);

  const { mutateAsync: toggleBookItNow } =
    api.properties.toggleBookItNow.useMutation();

  const { mutateAsync: updateBookItNow, isLoading: isUpdatingBookItNow } =
    api.properties.updateBookItNow.useMutation();

  const handleBookItNowSwitch = (checked: boolean) => {
    return toggleBookItNow({
      id: selectedProperty!.id,
      bookItNowEnabled: checked,
      currentHostTeamId: currentHostTeamId!,
    })
      .then(() => {
        setIsBookItNowChecked(checked);
        toast({
          title: "Update Successful",
          description: `Book it now ${checked ? "enabled" : "disabled"}`,
        });
      })
      .catch((error: TRPCClientErrorLike<AppRouter>) => {
        setIsBookItNowChecked((prev) => !checked);
        if (error.data?.code === "FORBIDDEN") {
          toast({
            title: "You do not have permission to change Co-host roles.",
            description: "Please contact your team owner to request access.",
          });
        } else {
          errorToast();
        }
      });
  };

  const handleBookItNowSlider = async (bookItNowPercent: number) => {
    setIsCalendarUpdating(true);
    await updateBookItNow({
      id: selectedProperty!.id,
      bookItNowHostDiscountPercentOffInput: bookItNowPercent,
      currentHostTeamId: currentHostTeamId!,
    }).finally(() => {
      setIsCalendarUpdating(false);
    });
  };

  const isLoading = loadingProperties || loadingPrices;

  return (
    <div className="mb-20 flex flex-col gap-4 p-2 sm:min-h-[calc(100vh-4rem)] sm:p-4 md:mb-0 lg:flex-row">
      {/* CALENDAR */}
      <Card className="h-full lg:w-3/5">
        {selectedProperty?.datesLastUpdated &&
          selectedProperty.iCalLinkLastUpdated &&
          selectedProperty.iCalLinkLastUpdated <
            selectedProperty.datesLastUpdated && (
            <CardBanner
              className="cursor-pointer bg-red-500 text-sm text-white"
              onClick={() => setHasDismissedModal(false)}
            >
              Calendar not synced
            </CardBanner>
          )}
        <CardContent className="h-full flex-col p-3 pb-2 sm:flex sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            {/* Left Side: Month/Year and Stats */}
            <div>
              <h2 className="mb-2 text-xl font-bold sm:text-2xl">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="text-xs font-medium sm:text-sm">
                <p className="py-1">
                  {isLoading
                    ? "Loading vacancies..."
                    : `${totalVacancies} vacancies this month`}
                </p>
                <p>
                  {isLoading
                    ? "Loading money left on table..."
                    : `$${leftOnTheTable.toFixed(2)} left on the table`}
                </p>
              </div>
            </div>

            {/* Right Side: Navigation + Dropdown */}
            <div className="flex flex-col gap-2">
              {/* Navigation Buttons Row */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => changeMonth(-1)}
                  className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {/* Updated the button to display current month here */}
                <Button variant="ghost" onClick={() => setDate(new Date())}>
                  {date.toLocaleString("default", { month: "long" })}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => changeMonth(1)}
                  className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Property Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="my-1 rounded-full border shadow-lg"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">
                      {selectedProperty?.name}
                    </span>
                    <span className="sm:hidden">Property</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select property</DropdownMenuLabel>
                  {hostProperties?.map((property) => (
                    <DropdownMenuItem
                      key={property.id}
                      onSelect={() =>
                        void router.push(
                          {
                            pathname: router.pathname,
                            query: { ...router.query, propertyId: property.id },
                          },
                          undefined,
                          { shallow: true },
                        )
                      }
                    >
                      {property.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="h-full flex-1">
            <MonthCalendar
              date={date}
              reservedDateRanges={reservedDates}
              prices={prices}
              isLoading={isLoading}
              isCalendarUpdating={isCalendarUpdating}
            />
          </div>
          <div className="mx-auto flex w-full gap-2">
            <HostICalSync property={selectedProperty} />
          </div>
        </CardContent>
      </Card>

      {/* SETTINGS */}
      {selectedProperty ? (
        <CalendarSettings
          property={selectedProperty}
          handleBookItNowSwitch={handleBookItNowSwitch}
          handleBookItNowSlider={handleBookItNowSlider}
          isUpdatingBookItNow={isUpdatingBookItNow}
          isBookItNowChecked={isBookItNowChecked}
          refetch={refetch} // sorry this is to invalidate the queries after the pricing update
        />
      ) : (
        <CalenderSettingsLoadingState />
      )}
      {selectedProperty?.datesLastUpdated &&
        selectedProperty.iCalLinkLastUpdated &&
        selectedProperty.iCalLinkLastUpdated <
          selectedProperty.datesLastUpdated && (
          <Dialog open={!hasDismissedModal} onOpenChange={setHasDismissedModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Calendar not synced</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                This calendar may be out of sync with your new bookings. The
                booking dates will be updated here within 2 hours (Don&apos;t
                worry, travelers will not be able to submit requests for the
                newly blocked dates.)
                <br />
                <br />
                If you wish to manually sync your calendar, please go on airbnb
                and click the &quot;Sync&quot; button.
              </DialogDescription>
              <Button onClick={() => setHasDismissedModal(true)}>
                Dismiss
              </Button>
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
}
