import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Users,
} from "lucide-react";
import { useSearchBarForm } from "./useSearchBarForm";
import { api } from "@/utils/api";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";
import SingleDateInput from "@/components/_common/SingleDateInput";
import { transformSearchResult } from "@/server/external-listings-scraping/airbnbScraper";

const locations = [
  {
    name: "Atlanta",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=300&h=200&fit=crop",
  },
  {
    name: "Austin",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=300&h=200&fit=crop",
  },
  {
    name: "Denver",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=300&h=200&fit=crop",
  },
  {
    name: "Puerto Rico",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1579687196544-08ae57ab5c11?w=300&h=200&fit=crop",
  },
  {
    name: "Florence",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=300&h=200&fit=crop",
  },
  {
    name: "Seattle",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=300&h=200&fit=crop",
  },
  {
    name: "Mykonos",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=300&h=200&fit=crop",
  },
  {
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200&fit=crop",
  },
  {
    name: "Porto",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=300&h=200&fit=crop",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&h=200&fit=crop",
  },
  {
    name: "New York",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop",
  },
  {
    name: "Los Angeles",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=300&h=200&fit=crop",
  },
  {
    name: "Nashville",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1545419913-775e3e82c7db?w=300&h=200&fit=crop",
  },
  {
    name: "Orlando",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1575089776834-8be34696ffb9?w=300&h=200&fit=crop",
  },
  {
    name: "Chicago",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=300&h=200&fit=crop",
  },
  {
    name: "Venice",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=300&h=200&fit=crop",
  },
  {
    name: "Miami",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1589083130544-0d6a2926e519?w=300&h=200&fit=crop",
  },
  {
    name: "Barcelona",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=200&fit=crop",
  },
  {
    name: "Milan",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?w=300&h=200&fit=crop",
  },
  {
    name: "Santorini",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop",
  },
  {
    name: "Nice",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=300&h=200&fit=crop",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=200&fit=crop",
  },
  {
    name: "Mexico City",
    country: "Mexico",
    image:
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=300&h=200&fit=crop",
  },
  {
    name: "London",
    country: "UK",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop",
  },
  {
    name: "Lisbon",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1580323956656-26bbb1206e34?w=300&h=200&fit=crop",
  },
  {
    name: "Cancún",
    country: "Mexico",
    image:
      "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=300&h=200&fit=crop",
  },
  {
    name: "Cannes",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1593014109521-48ea09f22592?w=300&h=200&fit=crop",
  },
  {
    name: "Madrid",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=300&h=200&fit=crop",
  },
  {
    name: "Rome",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=300&h=200&fit=crop",
  },
  {
    name: "Athens",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=300&h=200&fit=crop",
  },
  {
    name: "Cabo San Lucas",
    country: "Mexico",
    image:
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=300&h=200&fit=crop",
  },
  {
    name: "Honolulu",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=300&h=200&fit=crop",
  },
  {
    name: "New Orleans",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1549965738-e1aaf1168943?w=300&h=200&fit=crop",
  },
  {
    name: "San Diego",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1538689621163-f5be0ad13ec7?w=300&h=200&fit=crop",
  },
  {
    name: "Washington DC",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=300&h=200&fit=crop",
  },
];
export function DesktopSearchTab() {
  const { form, onSubmit } = useSearchBarForm();
  const containerRef = useRef<HTMLDivElement>(null);
  const { adjustedProperties, setAdjustedProperties, setIsSearching } = useAdjustedProperties();
  const runSubscrapers = api.properties.runSubscrapers.useMutation();

  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();

  const checkInDate = form.watch("checkIn");
  const checkOutDate = form.watch("checkOut");

  const [isTopOfPage, setIsTopOfPage] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopOfPage(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLocationClick = useCallback(
      (location: string) => {
        form.setValue("location", location);
      },
      [form],
  );

  const handleSearch = form.handleSubmit(async () => {
    setIsLoading(true);
    setIsSearching(true);
    const formData = form.getValues();
    console.log("Form data:", formData);
    setAdjustedProperties({
      pages: [],
    });

    if (formData.checkIn && formData.checkOut) {
      console.log("Running subscrapers...");
      try {
        const scrapedResultsPromise = utils.properties.getBookItNowProperties.fetch({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          numGuests: formData.numGuests!,
          location: formData.location!,
          firstBatch: true,
        });

        const airbnbResultsPromise = utils.misc.scrapeAirbnbInitialPage.fetch({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          numGuests: formData.numGuests!,
          location: formData.location!,
        });

        const airbnbResults = await airbnbResultsPromise;
        const scrapedResults = await scrapedResultsPromise;
        setAdjustedProperties((prevState) => ({
          ...prevState,
          pages: [...(prevState?.pages || []), ...scrapedResults, ...airbnbResults.res],
        }));

        setIsLoading(false);
        setIsSearching(false);

        const cursors = airbnbResults.data.staysSearch.results.paginationInfo.pageCursors.slice(1);

        const finishAirbnbResultsPromise = utils.misc.scrapeAirbnbPages.fetch({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          numGuests: formData.numGuests!,
          location: formData.location!,
          pageCursors: cursors,
        });

        const finishScrapedResultPromise = utils.properties.getBookItNowProperties.fetch({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          numGuests: formData.numGuests!,
          location: formData.location!,
          firstBatch: false,
        });

        const finishAirbnbResults = await finishAirbnbResultsPromise;
        setAdjustedProperties((prevState) => ({
          ...prevState,
          pages: [...(prevState?.pages || []), ...finishAirbnbResults],
        }));
        const finishScrapedResults = await finishScrapedResultPromise;
        setAdjustedProperties((prevState) => ({
          ...prevState,
          pages: [...(prevState?.pages || []), ...finishScrapedResults],
        }));

      } catch (error) {
        console.error("Error running subscrapers:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    } else {
      setIsLoading(false);
    }
  });

  const ScrollButtons = ({
                           containerRef,
                         }: {
    containerRef: React.RefObject<HTMLDivElement>;
  }) => {
    const scroll = useCallback(
        (direction: "left" | "right") => {
          if (containerRef.current) {
            containerRef.current.scrollBy({
              left:
                  direction === "left"
                      ? -containerRef.current.clientWidth
                      : containerRef.current.clientWidth,
              behavior: "smooth",
            });
          }
        },
        [containerRef],
    );

    return (
        <>
          <Button
              variant="ghost"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white"
              onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
              variant="ghost"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white"
              onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
    );
  };

  return (
      <Form {...form}>
        <form onSubmit={handleSearch} className="w-full">
          <div className="mx-auto mb-6 w-[1200px]">
            <div className="flex items-center justify-between rounded-full border border-black bg-white p-2">
              <div className="mx-2 flex w-[400px] items-center">
                <Search className="mr-2 text-gray-400" />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="w-full">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                                <SelectValue placeholder="Search destinations" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent
                                className="h-48 overflow-y-auto"
                                position="popper"
                            >
                              {locations.map((location) => (
                                  <SelectItem key={location.name} value={location.name}>
                                    {location.name}, {location.country}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                    )}
                />
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex w-[180px] items-center px-4">
                <CalendarDays className="mr-2 text-gray-400" />
                <FormField
                    control={form.control}
                    name={`checkIn`}
                    render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SingleDateInput
                                {...field}
                                value={field.value ? new Date(field.value) : undefined}
                                variant="lpDesktop"
                                placeholder="Check in"
                                disablePast
                                className="border-0 bg-transparent focus:ring-0 hover:bg-transparent"
                                maxDate={checkOutDate ? new Date(checkOutDate) : undefined}
                            />
                          </FormControl>
                        </FormItem>
                    )}
                />
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex w-[180px] items-center px-4">
                <CalendarDays className="mr-2 text-gray-400" />
                <FormField
                    control={form.control}
                    name={`checkOut`}
                    render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SingleDateInput
                                {...field}
                                value={field.value ? new Date(field.value) : undefined}
                                variant="lpDesktop"
                                placeholder="Check Out"
                                disablePast
                                className="border-0 bg-transparent focus:ring-0 hover:bg-transparent"
                                minDate={checkInDate ? new Date(checkInDate) : undefined}
                            />
                          </FormControl>
                        </FormItem>
                    )}
                />
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex w-[180px] items-center px-4">
                <Users className="mr-2 text-gray-400" />
                <FormField
                    control={form.control}
                    name="numGuests"
                    render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                                {...field}
                                type="number"
                                placeholder="1 Guest"
                                className="w-28 border-0 bg-white text-sm focus:ring-0"
                                onChange={(e) =>
                                    field.onChange(parseInt(e.target.value) || 1)
                                }
                            />
                          </FormControl>
                        </FormItem>
                    )}
                />
              </div>
              <Button
                  type="submit"
                  className="rounded-full bg-primaryGreen text-white"
                  disabled={isLoading}
              >
                {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                    <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {isTopOfPage && (
              <div className="relative">
                <ScrollButtons containerRef={containerRef} />
                <div
                    ref={containerRef}
                    id="location-container"
                    className="flex space-x-4 overflow-x-scroll scrollbar-hide"
                >
                  {locations.map((location) => (
                      <div
                          key={location.name}
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            handleLocationClick(location.name);
                            form.setValue("location", location.name);
                          }}
                      >
                        <div className="relative h-40 w-60 overflow-hidden rounded-lg">
                          <Image
                              src={location.image}
                              alt={location.name}
                              className="h-full w-full object-cover"
                              fill
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <h3 className="font-bold text-white">{location.name}</h3>
                            <p className="text-sm text-white">{location.country}</p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </form>
      </Form>
  );
}