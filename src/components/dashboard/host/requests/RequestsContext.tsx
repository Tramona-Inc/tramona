import { createContext, useContext } from "react";
import { SeparatedData } from "@/server/server-utils";

interface RequestsContextType {
  separatedData: SeparatedData | undefined;
  isLoading: boolean;
}

const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined,
);

export function RequestsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: RequestsContextType;
}) {
  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
}
