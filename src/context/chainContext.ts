"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AggregatedData } from "@/lib/generateChainData";

// Fetch function with error handling
async function fetchChainData(): Promise<AggregatedData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/chains`,
    //   { next: { revalidate: 43200 } } // 12-hour cache
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch chain data: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching chain data:", error);
    return []; // Return an empty array on error
  }
}

// Define the context type
interface ChainContextType {
  chains: AggregatedData[]; // Original list of chains
  searchQuery: string; // Current search query
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Function to update the search query
  filteredChains: AggregatedData[]; // Chains filtered based on the search query
}

// Initialize the context with default values
const ChainContext = createContext<ChainContextType | undefined>(undefined);

export const ChainProvider = ({ children }: { children: React.ReactNode }) => {
  const [chains, setChains] = useState<AggregatedData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const data = await fetchChainData();
      if (isMounted) {
        setChains(data);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter chains based on the search query
  const filteredChains = chains.filter(
    (chain) => chain.main.name.toLowerCase().includes(searchQuery.toLowerCase()) // Adjust the property based on your data structure
  );

  return (
    <ChainContext.Provider
      value={{ chains, searchQuery, setSearchQuery, filteredChains }}
    >
      {children}
    </ChainContext.Provider>
  );
};

// Custom hook for consuming the chain data
export const useChains = (): ChainContextType => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChains must be used within a ChainProvider");
  }
  return context;
};
