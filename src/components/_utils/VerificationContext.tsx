import React, { createContext, useContext, useState, ReactNode } from "react";

type VerificationStatus = "true" | "false" | "pending" | "NULL";

interface VerificationContextType {
  status: VerificationStatus;
  showBanner: boolean;
  setVerificationStatus: (status: VerificationStatus) => void;
  setShowVerificationBanner: (visible: boolean) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(
  undefined,
);

interface VerificationProviderProps {
  children: ReactNode;
}

export const VerificationProvider: React.FC<VerificationProviderProps> = ({
  children,
}) => {
  const [status, setStatus] = useState<VerificationStatus>("NULL");
  const [showBanner, setShowBanner] = useState(false);

  const setVerificationStatus = (newStatus: VerificationStatus) => {
    setStatus(newStatus);
    setShowBanner(newStatus === "pending" || newStatus === "true");
  };

  const setShowVerificationBanner = (visible: boolean) => {
    setShowBanner(visible);
  };

  return (
    <VerificationContext.Provider
      value={{
        status,
        showBanner,
        setVerificationStatus,
        setShowVerificationBanner,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error(
      "ERROR: useVerification must be used within VerificationProvider!!!",
    );
  }
  return context;
};
