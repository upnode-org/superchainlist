// import React, { createContext, useContext, useEffect, useState } from "react";
// import { AggregatedData, generateChainData } from "@/utils/generateChainData";

// const ChainContext = createContext(null);

// export const ChainProvider = ({ children }: { children: React.ReactNode }) => {
//     const [chains, setChains] = useState<AggregatedData[]>([]);

//     useEffect(() => {
//         (async () => {
//             const data = await generateChainData();
//             setChains(data);
//         })();
//     }, []);

//     return (
//         <ChainContext.Provider value={chains}>
//             {children}
//         </ChainContext.Provider>
//     );
// };

// export const useChains = () => useContext(ChainContext);
