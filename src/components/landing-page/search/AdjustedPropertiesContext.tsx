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
// Define the Property type based on your structure

export type AdjustedPropertiesType = InfiniteData<
  RouterOutputs["properties"]["getByBoundaryInfiniteScroll"]
>;

interface AdjustedPropertiesContextType {
  adjustedProperties: AdjustedPropertiesType | null;
  setAdjustedProperties: Dispatch<
    SetStateAction<AdjustedPropertiesType | null>
  >;
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
    useState<AdjustedPropertiesType | null>(null);

  return (
    <AdjustedPropertiesContext.Provider
      value={{ adjustedProperties, setAdjustedProperties }}
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
