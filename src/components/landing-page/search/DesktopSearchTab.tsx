// DesktopSearchTab.tsx
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useZodForm } from "@/utils/useZodForm";
import { searchSchema, defaultSearchOrReqValues } from "./schemas";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";
import { SearchFormBar } from "./SearchFormBar";
import { LocationGallery } from "./LocationGallery";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/server/db/schema";
import MobileSearchFormBar from "./MobileSearchFormBar";

interface DesktopSearchTabProps {
  isCompact?: boolean;
  handleTabChange: (tab: string, scroll?: boolean) => void;
}

export function DesktopSearchTab({
  isCompact = false,
  handleTabChange,
}: DesktopSearchTabProps) {
  const form = useZodForm({
    schema: searchSchema,
    defaultValues: defaultSearchOrReqValues,
    reValidateMode: "onSubmit",
  });

  type AirbnbSearchResult = {
    description: string | null | undefined;
    imageUrls: string[];
    maxNumGuests: number;
    name: string;
    nightlyPrice: number;
    originalListingId: string;
    originalNightlyPrice: number;
    originalListingPlatform: string;
    ratingStr: string | null | undefined;
  };

  const [allProperties, setAllProperties] = useState<{
    pages: (Property | AirbnbSearchResult)[];
  }>({ pages: [] });

  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();
  const { adjustedProperties, setAdjustedProperties } = useAdjustedProperties();

  const sortOptions = {
    none: "Select a value",
    leastExpensive: "Least Expensive",
    mostExpensive: "Most Expensive",
  };

  useEffect(() => {
    const data = searchSchema.safeParse(router.query);
    if (data.success) form.reset(data.data);
  }, [form, router.query]);

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
        return 0;
      });
  };

  const handleLocationSelect = useCallback(
    (location: string) => {
      form.setValue("location", location);
    },
    [form],
  );

  const handleSearch = form.handleSubmit(async (data) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    void router.replace(
      `${window.location.pathname}?${params.toString()}`,
      undefined,
      { shallow: true },
    );

    setAllProperties({ pages: [] });

    if (data.checkIn && data.checkOut) {
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
              ...(prevState.pages || []),
              ...propertiesInArea.hostProperties,
              ...propertiesInArea.scrapedProperties,
            ],
          };

          setAdjustedProperties({
            ...updatedProperties,
            pages: filterProperties(
              updatedProperties.pages.flat() as Property[],
              minPrice !== "" ? (Number(minPrice) * 100).toString() : minPrice,
              maxPrice !== "" ? (Number(maxPrice) * 100).toString() : maxPrice,
              priceSort,
            ),
          });

          return updatedProperties;
        });

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
              updatedProperties.pages.flat() as Property[],
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
              updatedProperties.pages.flat() as Property[],
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
      }
    } else {
      setIsLoading(false);
    }
  });


//   <div
//   className={`z-50 w-full transition-all duration-300 ease-in-out
//     sm:w-[400px]
//     md:w-[500px]
//     lg:w-[600px]
//     xl:w-[800px]
//     ${isCompact ? "scale-70" : "scale-100"}`}
// >
  return (
    <div className="w-full space-y-8 mt-4 py-4 mx-auto max-w-7xl px-4">
      <div className="">
        <div className="flex justify-center">
          {/* Mobile Search */}
          <div className="w-full lg:hidden">
            <MobileSearchFormBar
              form={form}
              onSubmit={handleSearch}
              isLoading={isLoading}
            />
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center gap-4">
            <div
              className={`z-50 transition-all duration-300 ease-in-out ${
                isCompact ? "w-[600px]" : "w-[800px]"
              }`}
            >
              <SearchFormBar
                form={form}
                onSubmit={handleSearch}
                isLoading={isLoading}
                isCompact={isCompact}
              />
            </div>

            {/* Divider */}
            <div
              className={`hidden xl:flex flex-shrink-0 flex-col items-center justify-center transition-all duration-300 ease-in-out ${
                isCompact ? "h-10 text-xs" : "h-14 text-base"
              }`}
            >
              <div className="h-4 w-px bg-slate-700" />
              <span className="my-1 text-sm">or</span>
              <div className="h-4 w-px bg-slate-700" />
            </div>

            {/* Button */}
            <Button
              onClick={() => handleTabChange("name-price", true)}
              variant="outline"
              className={`hidden xl:block flex-shrink-0 whitespace-nowrap border border-black transition-all duration-300 ease-in-out ${
                isCompact ? "h-10 px-3 text-xs" : "h-14 px-6 text-base"
              }`}
            >
              Name your own price
            </Button>
          </div>
        </div>
      </div>


      {/* <div className={`hidden lg:flex w-full flex-row items-center justify-center space-x-2 px-16 z-50 transition-all duration-300 ease-in-out ${
                isCompact ? "w-[600px]" : "w-[800px]"
              }`}> */}

      <div className="hidden lg:flex w-full flex-row items-center justify-center space-x-2 px-16">
        <LocationGallery
          onLocationSelect={handleLocationSelect}
          isCompact={isCompact}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="rounded-md border-gray-300 text-gray-600 hover:bg-gray-200"
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
              onValueChange={(value) => setPriceSort(value)}
              value={priceSort}
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
                        allProperties.pages.flat() as Property[],
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
      </div>
    </div>
  );
}
