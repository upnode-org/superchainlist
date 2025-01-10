import { SectionTitle, Subtitle, Title } from "@/components/Typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AggregatedData, generateChainData, Superchain } from "@/utils/generateChainData";
import { notFound } from "next/navigation";
import IconImage from "@/components/IconImage";
import { capitalize, cn } from "@/lib/utils";
import Container from "@/components/Container";
import NetworkCard from "@/components/NetworkCard";
import { Badge } from "@/components/ui/badge";
import classNames from "classnames";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

// L1 Contract
// Contract addresses for L1
// L2 contracts are the same i believe


interface ChainParams {
    params: {
        chainIdOrName: string;
    };
}

// Disable dynamic params for chains not in chain data
export const dynamicParams = false;

// Pre-generate static paths
export async function generateStaticParams() {
    const chains = await generateChainData();

    const params: Array<{ chainIdOrName: string }> = [];

    for (const key in chains) {
        const chain = chains[key];
        if (chain?.main?.chainId) {
            params.push({ chainIdOrName: chain.main.chainId.toString() });
        }
        if (chain?.main?.chain) {
            params.push({ chainIdOrName: chain.main.chain.toLowerCase() });
        }
    }

    return params;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { chainIdOrName: string } }) {
    const { chainIdOrName } = await params;
    const chain = await getChain(chainIdOrName)
    if (chain) {
        return {
            title: `Superchain: ${chain.main.name}`,
            description: `Explore details of the ${chain.main.name} blockchain, including network RPCs, block explorers, and other network configurations.`,
            openGraph: {
                title: `${chain.main.name} Blockchain Details`,
                description: `Comprehensive details of ${chain.main.name}, including chain ID: ${chain.main.chainId}, network RPCs, and block explorers.`,
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/chain/${chainIdOrName}`,
            },
            twitter: {
                card: "summary_large_image",
                title: `${chain.main.name} Blockchain Overview`,
                description: `Explore ${chain.main.name} with chain ID ${chain.main.chainId}. Learn more about its network, configurations, and services.`,
            },
        };
    } else {
        // Fallback metadata for not found chains, should return not found page anyway
        return {
            title: `Chain Not Found: ${decodeURIComponent(chainIdOrName)}`,
            description: `The blockchain with ID or name ${decodeURIComponent(chainIdOrName)} could not be found. Check the chain ID or name and try again.`,
        };
    }
}

const getChain = async (chainIdOrName: string) => {
    const chains: AggregatedData[] = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chains`, {
        next: { revalidate: 46000 }, // Revalidate data every 60 seconds
    }).then((res) => res.json());

    const decodedChainIdOrName = decodeURIComponent(chainIdOrName);

    // Check if chainIdOrName is a number or string
    const isNumber = !isNaN(Number(decodedChainIdOrName));

    // Filter the chain data for the specific chainIdOrName
    const chain = Object.values(chains).find((chain: any) => {
        if (isNumber) {
            // Search by chainId if it's a number
            return chain.main.chainId.toString() === decodedChainIdOrName;
        } else {
            // Search by chain name if it's a string
            return chain.main.chain.toLowerCase() === decodedChainIdOrName.toLowerCase();
        }
    });

    return chain
}

// Main page component with ISG
export default async function ChainPage({ params }: { params: { chainIdOrName: string } }) {
    const { chainIdOrName } = params;
    const chain: AggregatedData | undefined = await getChain(chainIdOrName)
    if (chain === undefined) {
        notFound();
    }
    console.log(chain);
    return (
        <div className="flex flex-col gap- h-full">
            <div className={`bg-red-500`}>
                <Container className="flex flex-col p-6">
                    <div className="flex justify-between">
                        <Title>{chain.main.name}</Title>
                        <div>
                            <IconImage iconParam={chain.main.icon} size={32} />
                        </div>
                    </div>

                    <div className=" space-x-1 mt-2">
                        {
                            chain.main.governedByOptimism &&
                            <Badge variant={"outline"} className="bg-[#FF0420] text-white rounded-full">Governed by Optimism</Badge>}
                        {
                            chain.main.infoURL &&
                            <Link href={chain.main.infoURL}>
                                <Badge variant={"outline"} className=" rounded-full gap-1 bg-white">
                                    {chain.main.infoURL}
                                    <ExternalLink className="size-3"></ExternalLink>
                                </Badge>
                            </Link>
                        }
                        {
                            chain.main.dataAvailabilityType &&
                            <Badge variant="outline" className={classNames("rounded-full",
                                chain.main.dataAvailabilityType === "eth-da" ? "bg-[#5C5CFF] text-white"
                                    : "bg-purple-500 text-white")}>
                                {chain.main.dataAvailabilityType === "eth-da" ? "Settled on Etheruem" : "Settled on Altchain"}
                            </Badge>
                        }
                        {
                            chain.main.chainId &&
                            <Badge variant="outline" className="rounded-full bg-black text-white">
                                Chain ID {chain.main.chainId}
                            </Badge>
                        }
                    </div>
                </Container>
            </div>


            <Container>
                <Tabs defaultValue="mainnet" className="w-full">
                    <TabsList className={cn("inline-flex flex-grow w-full cursor")}>
                        {/* Mainnet Tab */}
                        <TabsTrigger value="mainnet" className="flex-grow">Mainnet</TabsTrigger>

                        {/* Dynamically Generate Tabs */}
                        {chain.other.map(({ identifier }) => {
                            const net = identifier.split("/")[0];
                            return (
                                <TabsTrigger key={identifier} value={net} className="flex-grow">
                                    {capitalize(net)}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>


                    {/* Mainnet Content */}
                    <TabsContent value="mainnet">
                        <NetworkCard network={chain.main} />
                    </TabsContent>

                    {/* Dynamically Generate Content */}
                    {chain.other.map((chain) => {
                        const net = chain.identifier.split("/")[0];
                        return (
                            <TabsContent key={net} value={net}>
                                <NetworkCard network={chain} />
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </Container>
        </div>
    );
}