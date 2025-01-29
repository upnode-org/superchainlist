import { SectionTitle, Subtitle, Title } from "@/components/Typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getChains, { AggregatedData } from "@/lib/getChainData";
import { notFound } from "next/navigation";
import IconImage from "@/components/IconImage";
import { capitalize, cn, parseStringValue } from "@/lib/utils";
import Container from "@/components/Container";
import NetworkCard from "@/components/NetworkCard";
import { Badge } from "@/components/ui/badge";
import classNames from "classnames";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getContrastingTextColor } from "@/lib/getAverageColor";

// TODO:
// L1 Contract
// Contract addresses for L1
// L2 contracts are the same i believe
// TX Debugger
// Wallet interactions

interface ChainParams {
    params: {
        chainIdOrName: string;
    };
}

// Disable dynamic params for chains not in chain data
export const dynamicParams = false;

// Pre-generate static paths
export async function generateStaticParams() {
    const chains = await getChains();

    return Object.values(chains).flatMap((chain: AggregatedData) => [
        { chainIdOrName: chain.main.chainId.toString() }, // Chain ID
        { chainIdOrName: chain.main.name.toLowerCase() }, // Chain Name
    ]);
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { chainIdOrName: string } }) {
    const { chainIdOrName } = await params;
    const chain = await getChains(chainIdOrName);

    if (!chain) {
        return {
            title: `Chain Not Found: ${decodeURIComponent(chainIdOrName)}`,
            description: `The blockchain with ID or name ${decodeURIComponent(chainIdOrName)} could not be found.`,
        };
    }

    return {
        title: `Superchain: ${chain.main.name}`,
        description: `Explore details of the ${chain.main.name} chain.`,
        openGraph: {
            title: `${chain.main.name} Superchain Details`,
            description: `Details of the ${chain.main.name} chain.`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/chain/${chainIdOrName}`,
        },
        twitter: {
            card: "summary_large_image",
            title: `${chain.main.name} Blockchain Overview`,
            description: `Explore ${chain.main.name} with chain ID ${chain.main.chainId}.`,
        },
    };
}

export default async function ChainPage({ params }: ChainParams) {
    const { chainIdOrName } = await params;

    const parsedValue = parseStringValue(chainIdOrName)

    let chain: AggregatedData | undefined;

    if(typeof parsedValue === 'number'){
        chain = await getChains(parsedValue)
    } else if(typeof parsedValue === 'string'){
        chain = await getChains(parsedValue)
    } 
    
    if (chain === undefined){
        notFound();
    }  

    return (
        <div className="flex flex-col gap- h-full">
            <div style={{ backgroundColor: chain.main.logoColors?.mostCommon }}>

                <Container className="flex flex-col p-6">
                    <div className="flex justify-between"
                        style={{
                            color: getContrastingTextColor(chain.main.logoColors?.mostCommon || '#000000')
                        }}
                    >
                        <Title className="">{chain.main.name}</Title>
                        <div>
                            <IconImage iconParam={chain.main.logo} size={32} />
                        </div>
                    </div>

                    <div className=" space-x-1 mt-2">
                        {
                            chain.main.governedByOptimism &&
                            <Badge variant={"default"} className="bg-[#FF0420] text-white rounded-full shadow-inner">Governed by Optimism</Badge>}
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