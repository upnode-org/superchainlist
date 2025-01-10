// import { getImageColorsFromURL } from "@/lib/getAverageColor";

interface ChainIdNetworkItem {
  name: string;
  chain: string;
  icon: string;
  network: string;
  rpc?: string[];
  faucets: string[];
  nativeCurrency: {
    name: string;
    symbols: string;
    decimals: number;
  };
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  slip44: number;
  ens: {
    registry: string;
  };
  explorers?: Array<{
    name: string;
    url: string;
    standard?: string;
  }>;
}

interface DefiLlamaChainTvl {
  gecko_id: string;
  tvl: number;
  tokenSymbol: string;
  cmcId: string;
  name: string;
  chainId: number;
}

interface SuperchainEntry {
  name: string;
  chainId: number;
  identifier: string;
  rpc: string[];
  explorers: string[];
  superchainLevel: number;
  governedByOptimism: boolean;
  dataAvailabilityType: "eth-da" | "alt-da";
  parent: {
    type: "L1" | "L2";
    chain: "mainnet" | "sepoila";
  };
}

// Omit explorers from both sources, and make chainid.network partial
type PartialChainIdNetworkItem = {
  [K in keyof ChainIdNetworkItem]?: ChainIdNetworkItem[K];
};
type PartialChainIdWithoutExplorers = Omit<
  PartialChainIdNetworkItem,
  "explorers"
>;
type WithoutExplorersFromSuperchain = Omit<SuperchainEntry, "explorers">;

export type Superchain = WithoutExplorersFromSuperchain &
  PartialChainIdWithoutExplorers & {
    explorers: string[];
    icon?: string;
    symbol?: string;
    tvl?: number;
    iconColors?: {
      average: string;
      mostCommon: string;
    };
  };

/**
 * A small helper fetch function that returns JSON from a given URL.
 */
const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch: ${url} — ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();

  // If 'data' exists and is an array, return it directly
  if (json && Array.isArray(json.data)) {
    return json.data;
  }

  return json; // Fallback to returning the whole object
};

/**
 * Fetch and convert chainid.network data into a Map<chainId, ChainIdNetworkItem>.
 */
async function getChainIdNetworkMap(): Promise<
  Map<number, ChainIdNetworkItem>
> {
  const chainIdNetworkData = (await fetcher(
    "https://chainid.network/chains.json"
  )) as ChainIdNetworkItem[];

  const lookup = new Map<number, ChainIdNetworkItem>();
  for (const chain of chainIdNetworkData) {
    lookup.set(chain.chainId, chain);
  }

  return lookup;
}

/**
 * Fetch and convert DeFi Llama chain TVL data into a Map<chainId, DefiLlamaChainTvl>.
 */
async function getDefiLlamaTvlMap(): Promise<Map<number, DefiLlamaChainTvl>> {
  const llamaTVL = (await fetcher(
    "https://api.llama.fi/chains"
  )) as DefiLlamaChainTvl[];

  const lookup = new Map<number, DefiLlamaChainTvl>();
  for (const chain of llamaTVL) {
    lookup.set(chain.chainId, chain);
  }

  return lookup;
}

/**
 * Fetch the Superchain registry data (an array of SuperchainEntry).
 */
async function getSuperchainEntries(): Promise<SuperchainEntry[]> {
  return (await fetcher(
    "https://raw.githubusercontent.com/ethereum-optimism/superchain-registry/refs/heads/main/chainList.json"
  )) as SuperchainEntry[];
}

/**
 * Merge a SuperchainEntry with (optional) ChainIdNetworkItem and DefiLlama data.
 */
async function enrichSuperchainEntry(
  superchain: SuperchainEntry,
  chainIdData?: ChainIdNetworkItem,
  llamaData?: DefiLlamaChainTvl
): Promise<Superchain> {
  // Merge explorers from both
  const superchainExplorers = superchain.explorers ?? [];
  const chainIdExplorers = chainIdData?.explorers?.map((e) => e.url) ?? [];
  const mergedExplorers = [
    ...new Set([...superchainExplorers, ...chainIdExplorers]),
  ];

  // Use DeFi Llama data to set an icon if present
  const icon = llamaData
    ? `https://icons.llamao.fi/icons/chains/rsz_${llamaData.name}.jpg`
    : undefined;
  llamaData?.tokenSymbol;

  let iconColors: { average: string; mostCommon: string } | undefined;
  // if (icon) {
  //   const result = await getImageColorsFromURL(icon);
  //   if (result) {
  //     iconColors = {
  //       average: result.averageColor,
  //       mostCommon: result.mostCommonColor,
  //     };
  //   }
  // }

  // Omit explorers from chainIdData to avoid conflicts
  const { explorers: _unused, ...restChainIdData } = chainIdData ?? {};

  return {
    // Superchain fields (minus explorers)
    ...superchain,

    // chainid.network fields (minus explorers, partially)
    ...restChainIdData,

    // Our single merged explorers array
    explorers: mergedExplorers,
    icon,
    symbol: llamaData?.tokenSymbol,
    tvl: llamaData?.tvl,
    iconColors
  };
}

/**
 * Build the final structure so that for each group of networks with the same
 * `identifier.split("/")[1]` (the 'rightKey'), we designate:
 *
 *   - `main`: the mainnet of that Superchain network with 
 *     leftKey === "mainnet", or the first one otherwise
 *   - `others`: an array of the remaining Superchains relating
 *      to the mainnet ie. testnets
 *
 * Result shape:
 * [
 *   {
 *     main: Superchain,
 *     others: Superchain[]
 *   }
 * ]
 */

export type AggregatedData = {
  main: Superchain;
  other: Superchain[];
};

function buildAggregatedChainStructure(enrichedSuperchains: Superchain[]) {
  // Group them by the rightKey portion of the identifier
  // This would break if mainnets were not processed first, sort?

  const aggregatedData: AggregatedData[] = [];

  for (const chain of enrichedSuperchains) {
    const [leftKey, rightKey] = chain.identifier.split("/");

    // Make sure we have a bucket for the rightKey
    if (leftKey === "mainnet") {
      aggregatedData.push({
        main: chain,
        other: [],
      });
      continue;
    }

    // Otherwise, try to place it in an existing block with near matching identifier
    let placed = false;
    for (let i = 0; i < aggregatedData.length; i++) {
      const [_, aggregatedDataRightKey] = aggregatedData[i].main.identifier.split("/")
      if (rightKey.includes(aggregatedDataRightKey)) {
        aggregatedData[i].other.push(chain);
        placed = true;
        break;
      }
    }

    // If we can't find a suitable existing block, create one
    if (!placed) {
      aggregatedData.push({
        main: chain,
        other: [],
      });
    }
  }

  return aggregatedData
}

/**
 * Generate chain data by combining:
 * 1) chainid.network
 * 2) DeFi Llama
 * 3) Superchain registry
 *
 * Only matching by chainId, plus merging explorers into a single string[] of URLs.
 *
 * The final shape is:
 * {
 *   [rightKey]: {
 *     main: Superchain,
 *     others: Superchain[]
 *   }
 * }
 */
export async function generateChainData(): Promise<AggregatedData[]> {
  // Fetch / assemble maps / arrays
  const [chainIdMap, defiLlamaMap, superchainEntries] = await Promise.all([
    getChainIdNetworkMap(),
    getDefiLlamaTvlMap(),
    getSuperchainEntries(),
  ]);

  // Enrich each superchain with data from chainid.network + DeFi Llama
  const enrichedSuperchains = await Promise.all(
    superchainEntries.map(async (sc) => {
      const chainData = chainIdMap.get(sc.chainId);
      const llamaData = defiLlamaMap.get(sc.chainId);
      return enrichSuperchainEntry(sc, chainData, llamaData);
    })
  );

  // Build the aggregated structure from the enriched superchains
  return buildAggregatedChainStructure(enrichedSuperchains);
}
