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
  Filter,
} from "lucide-react";
import { api } from "@/utils/api";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";
import SingleDateInput from "@/components/_common/SingleDateInput";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { defaultSearchOrReqValues } from "./schemas";
import { searchSchema } from "./schemas";
import { useZodForm } from "@/utils/useZodForm";
import { Property } from "@/server/db/schema";
import { useRouter } from "next/router";

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

type AirbnbSearchResult = {
  description: string | null | undefined;
  imageUrls: string[];
  maxNumGuests: number;
  name: string;
  nightlyPrice: number;
  originalListingId: string;
  originalNightlyPrice: number;
  originalListingPlatform: string;
  ratingStr: string;
};
export function DesktopSearchTab() {
  const form = useZodForm({
    schema: searchSchema,
    defaultValues: defaultSearchOrReqValues,
    reValidateMode: "onSubmit",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { adjustedProperties, setAdjustedProperties, setIsSearching } =
    useAdjustedProperties();

  const [allProperties, setAllProperties] = useState<{
    pages: (Property | AirbnbSearchResult)[];
  }>({ pages: [] });

  // const { isLoading } = api.properties.getBookItNowProperties.useQuery(
  //   {
  //     checkIn: form.watch("checkIn")!,
  //     checkOut: form.watch("checkOut")!,
  //     numGuests: form.watch("numGuests")!,
  //     location: form.watch("location")!,
  //   },
  //   {
  //     enabled:
  //       !!form.watch("checkIn") &&
  //       !!form.watch("checkOut") &&
  //       !!form.watch("numGuests") &&
  //       !!form.watch("location"),
  //     onSuccess: (data) => {
  //       const updatedProperties = {
  //         pages: [...data.hostProperties, ...data.scrapedProperties],
  //       };

  //       // Filter the properties and set adjustedProperties via context
  //       const filtered = filterProperties(
  //         updatedProperties.pages?.flat() || [],
  //         minPrice !== "" ? minPrice * 100 : undefined,
  //         maxPrice !== "" ? maxPrice * 100 : undefined,
  //         priceSort,
  //       );

  //       setAdjustedProperties({
  //         ...updatedProperties,
  //         pages: filtered,
  //       });

  //       setAllProperties(updatedProperties);
  //       setIsSearching(false);
  //     },
  //   },
  // );

  // const airbnbProperties = api.misc.scrapeAirbnbInitialPage.useQuery(
  //   {
  //     checkIn: form.watch("checkIn")!,
  //     checkOut: form.watch("checkOut")!,
  //     numGuests: form.watch("numGuests")!,
  //     location: form.watch("location")!,
  //   },
  //   {
  //     enabled:
  //       !!form.watch("checkIn") &&
  //       !!form.watch("checkOut") &&
  //       !!form.watch("numGuests") &&
  //       !!form.watch("location"),
  //     onSuccess: (data) => {
  //       setAllProperties((prevState) => ({
  //         ...prevState,
  //         pages: [...(prevState.pages || []), data.res],
  //       }));

  //       setAdjustedProperties({
  //         ...allProperties,
  //         pages: filterProperties(
  //           allProperties.pages?.flat() || [],
  //           minPrice !== "" ? minPrice * 100 : undefined,
  //           maxPrice !== "" ? maxPrice * 100 : undefined,
  //           priceSort,
  //         ),
  //       });
  //     },
  //   },
  // );

  // const cursors =
  //   airbnbProperties.data?.data.staysSearch.results.paginationInfo.pageCursors.slice(
  //     1,
  //   );

  // const scrapeAirbnbPages = api.misc.scrapeAirbnbPages.useQuery(
  //   {
  //     checkIn: form.watch("checkIn")!,
  //     checkOut: form.watch("checkOut")!,
  //     numGuests: form.watch("numGuests")!,
  //     location: form.watch("location")!,
  //     pageCursors: cursors,
  //   },
  //   {
  //     enabled: !!cursors,
  //     onSuccess: (data) => {
  //       setAllProperties((prevState) => ({
  //         ...prevState,
  //         pages: [...(prevState.pages || []), data],
  //       }));

  //       setAdjustedProperties({
  //         ...allProperties,
  //         pages: filterProperties(
  //           allProperties.pages?.flat() || [],
  //           minPrice !== "" ? minPrice * 100 : undefined,
  //           maxPrice !== "" ? maxPrice * 100 : undefined,
  //           priceSort,
  //         ),
  //       });
  //     },
  //   },
  // );

  //const runSubscrapers = api.properties.runSubscrapers.useMutation();
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [priceSort, setPriceSort] = useState("");

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();
  const router = useRouter();
  const checkInDate = form.watch("checkIn");
  const checkOutDate = form.watch("checkOut");

  const sortOptions = {
    none: "Select a value",
    leastExpensive: "Least Expensive",
    mostExpensive: "Most Expensive",
  };

  useEffect(() => {
    const data = searchSchema.safeParse(router.query);
    if (data.success) form.reset(data.data);
  }, [form, router.query]);

  const handleLocationClick = useCallback(
    (location: string) => {
      form.setValue("location", location);
    },
    [form],
  );

  const handleSearch = form.handleSubmit(async (data) => {
    setIsLoading(true);
    setIsSearching(true);
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    void router.replace(
      `${window.location.pathname}?${params.toString()}`,
      undefined,
      { shallow: true },
    );

    setAllProperties({
      pages: [],
    });

    if (data.checkIn && data.checkOut) {
      console.log("Running subscrapers...");
      try {
        const propertiesInArea =
          await utils.properties.getBookItNowProperties.fetch({
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            numGuests: data.numGuests!,
            location: data.location!,
          });

        setAllProperties((prevState) => {
          const updatedProperties = {
            ...prevState,
            pages: [
              ...(prevState?.pages || []),
              ...propertiesInArea.hostProperties,
              ...propertiesInArea.scrapedProperties,
            ],
          };

          // Immediately set adjustedProperties after updating allProperties
          setAdjustedProperties({
            ...updatedProperties,
            pages: filterProperties(
              updatedProperties.pages.flat() || [],
              minPrice !== "" ? (Number(minPrice) * 100).toString() : minPrice,
              maxPrice !== "" ? (Number(maxPrice) * 100).toString() : maxPrice,
              priceSort,
            ),
          });

          return updatedProperties;
        });

        setIsLoading(false);
        setIsSearching(false);
        const airbnbResultsPromise = utils.misc.scrapeAirbnbInitialPage.fetch({
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          numGuests: data.numGuests!,
          location: data.location!,
        });
        const airbnbResults = await airbnbResultsPromise;

        setAllProperties((prevState) => {
          const updatedProperties = {
            ...prevState,
            pages: [...(prevState?.pages || []), ...airbnbResults.res],
          };

          setAdjustedProperties({
            ...updatedProperties,
            pages: filterProperties(
              updatedProperties.pages?.flat() || [],
              minPrice !== "" ? (Number(minPrice) * 100).toString() : minPrice,
              maxPrice !== "" ? (Number(maxPrice) * 100).toString() : maxPrice,
              priceSort,
            ),
          });
          return updatedProperties;
        });

        const cursors =
          airbnbResults.data.staysSearch.results.paginationInfo.pageCursors.slice(
            1,
          );

        const finishAirbnbResultsPromise = utils.misc.scrapeAirbnbPages.fetch({
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          numGuests: data.numGuests!,
          location: data.location!,
          pageCursors: cursors,
        });

        const finishAirbnbResults = await finishAirbnbResultsPromise;
        setAllProperties((prevState) => {
          const updatedProperties = {
            ...prevState,
            pages: [...(prevState?.pages || []), ...finishAirbnbResults],
          };

          setAdjustedProperties({
            ...updatedProperties,
            pages: filterProperties(
              updatedProperties.pages?.flat() || [],
              minPrice !== "" ? (Number(minPrice) * 100).toString() : minPrice,
              maxPrice !== "" ? (Number(maxPrice) * 100).toString() : maxPrice,
              priceSort,
            ),
          });

          return updatedProperties;
        });
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

  console.log("all props", allProperties);

  console.log("filteredProps", adjustedProperties);

  const filterProperties = (
    properties: Property[],
    minPrice: string,
    maxPrice: string,
    priceSort: string,
  ) => {
    if (minPrice === "" && maxPrice === "" && priceSort === "") {
      return properties;
    }
    return properties
      .filter((property: Property) => {
        const price = property.originalNightlyPrice!;
        const meetsMinPrice = !minPrice || price >= parseFloat(minPrice);
        const meetsMaxPrice = !maxPrice || price <= parseFloat(maxPrice);
        return meetsMinPrice && meetsMaxPrice;
      })
      .sort((a, b) => {
        if (priceSort === "leastExpensive") {
          return a.originalNightlyPrice! - b.originalNightlyPrice!;
        }
        if (priceSort === "mostExpensive") {
          return b.originalNightlyPrice! - a.originalNightlyPrice!;
        }
        return 0; // No sorting if "none" or undefined
      });
  };

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
                        className="border-0 bg-transparent hover:bg-transparent focus:ring-0"
                        maxDate={
                          checkOutDate ? new Date(checkOutDate) : undefined
                        }
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
                        className="border-0 bg-transparent hover:bg-transparent focus:ring-0"
                        minDate={
                          checkInDate ? new Date(checkInDate) : undefined
                        }
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="ml-4 rounded-full border-gray-300 text-gray-600 hover:bg-gray-200"
            >
              <Filter className="mr-1 h-4 w-4" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Price Filters</DialogTitle>
            </DialogHeader>
            <div className="flex w-full justify-between">
              <div>
                <div>Min Price</div>
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div>
                <div>Max Price</div>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <div>Sort by Price</div>
            <Select
              onValueChange={(value) => setPriceSort(value)} // Binds to form field
              value={priceSort} // Default to "none" if no value is selected
            >
              <SelectTrigger className="w-full border-gray-300 bg-white">
                <SelectValue
                  className={
                    priceSort === "none" ? "text-gray-400" : "text-black"
                  }
                >
                  {priceSort === "none"
                    ? "Select a value"
                    : sortOptions[priceSort as keyof typeof sortOptions]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.entries(sortOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  setPriceSort("none");
                }}
              >
                Clear Filters
              </Button>
              <Button
                onClick={() => {
                  setAdjustedProperties((prevState) => {
                    if (!prevState) return null;
                    return {
                      ...prevState,
                      pages: filterProperties(
                        allProperties.pages?.flat() || [],
                        minPrice !== ""
                          ? (Number(minPrice) * 100).toString()
                          : minPrice,
                        maxPrice !== ""
                          ? (Number(maxPrice) * 100).toString()
                          : maxPrice,
                        priceSort,
                      ),
                    };
                  });
                  setOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
      </form>
    </Form>
  );
}
