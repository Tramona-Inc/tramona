import { type DateRange } from "react-day-picker";

export interface SearchFormData {
  location: string;
  dates: DateRange | undefined;
  guests: number;
  minPrice: string;
  maxPrice: string;
}

export interface SearchTabProps {
  activeTab: "search" | "request";
  setActiveTab: (tab: "search" | "request") => void;
}
