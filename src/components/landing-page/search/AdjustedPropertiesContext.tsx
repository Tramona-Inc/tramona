import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { type InfiniteData } from "@tanstack/react-query";
import { type RouterOutputs } from "@/utils/api";
import { Property } from "@/server/db/schema";
// Define the Property type based on your structure

export type AdjustedPropertiesType = InfiniteData<
  RouterOutputs["properties"]["getByBoundaryInfiniteScroll"]
>;

export type AirbnbSearchResult = {
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

export type PropertyPages = {
  pages: (Property | AirbnbSearchResult)[];
};

interface AdjustedPropertiesContextType {
  adjustedProperties: PropertyPages | null;
  setAdjustedProperties: Dispatch<SetStateAction<PropertyPages | null>>;
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
}

// Create a context
const AdjustedPropertiesContext =
  createContext<AdjustedPropertiesContextType | null>(null);

interface AdjustedPropertiesProviderProps {
  children: ReactNode;
}

// Create a provider component
export function AdjustedPropertiesProvider({
  children,
}: AdjustedPropertiesProviderProps) {
  const [adjustedProperties, setAdjustedProperties] =
    useState<PropertyPages | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <AdjustedPropertiesContext.Provider
      value={{
        adjustedProperties,
        setAdjustedProperties,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </AdjustedPropertiesContext.Provider>
  );
}

// Create a custom hook to use the context
export function useAdjustedProperties() {
  const context = useContext(AdjustedPropertiesContext);
  if (!context) {
    throw new Error(
      "useAdjustedProperties must be used within an AdjustedPropertiesProvider",
    );
  }
  return context;
}
