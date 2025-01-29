"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { AggregatedData } from "@/lib/getChainData";

interface ChainContextType {
  chains: AggregatedData[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredChains: AggregatedData[];
}

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export const ChainProvider = ({
  children,
  initialChains,
}: {
  children: React.ReactNode;
  initialChains: AggregatedData[];
}) => {
  const [chains, setChains] = useState<AggregatedData[]>(initialChains);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch data only if initialChains is empty
  useEffect(() => {
    let isSubscribed = true;

    if (chains.length === 0) {
      console.log("Fetching chain data from client side");
      (async () => {
        try {
          const res = await fetch("/api/chains");
          if (!res.ok) throw new Error("Failed to fetch chains");
          const data = await res.json();
          if (isSubscribed) {
            setChains(data);
          }
        } catch (error) {
          console.error(error);
        }
      })();
    } 

    return () => {
      isSubscribed = false;
    };
  }, [chains.length]); // <- Dependency added for clarity

  // Memoized filtered chains
  const filteredChains = useMemo(
    () =>
      chains.filter((chain) =>
        chain?.main?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [chains, searchQuery]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue: ChainContextType = {
    chains,
    searchQuery,
    setSearchQuery,
    filteredChains,
  };

  return (
    <ChainContext.Provider value={contextValue}>
      {children}
    </ChainContext.Provider>
  );
};

export const useChains = (): ChainContextType => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChains must be used within a ChainProvider");
  }
  return context;
};
