"use client";

import { createContext, useContext, useState } from "react";

type TourContextType = {
  runTour: boolean;
  setRunTour: React.Dispatch<React.SetStateAction<boolean>>;
};

const TourContext = createContext<TourContextType | null>(null);

export function TourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [runTour, setRunTour] = useState(false);

  return (
    <TourContext.Provider
      value={{
        runTour,
        setRunTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  return useContext(TourContext)!;
}