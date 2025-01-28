import { AggregatedData } from "@/lib/generateChainData";
import Link from "next/link"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { capitalize } from "@/lib/utils"
import FallbackImage from "./FallbackImage";

export default function ChainGrid({ chains }: { chains: AggregatedData[] }) {
    return (
        <div className="size-full">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 ">
                {chains.map((chain: AggregatedData) => {
                    const { main } = chain
                    
                    return (
                        <ChainCard
                            key={main.chainId}
                            name={main.name}
                            logoUrl={main.logo || undefined}
                            bannerColor={main.logoColors?.mostCommon || "#ffd4a8"}
                            chainId={main.chainId}
                            governedByOptimism={main.governedByOptimism}
                        />
                    );
                })}
            </div>
        </div>
    )
}

interface ChainCardProps {
    name: string
    logoUrl: string | undefined
    bannerColor: string
    chainId: number
    governedByOptimism: boolean
}

function ChainCard({
    name,
    logoUrl,
    bannerColor,
    chainId,
    governedByOptimism
}: ChainCardProps) {
    return (
        <Link href={`/chain/${chainId}`} className="flex justify-center">
            <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
                <div className="relative">
                    <div
                        className="h-16 w-full"
                        style={{ backgroundColor: bannerColor }}
                        aria-hidden="true"
                    />
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <div className="relative w-24 h-24">
                            <FallbackImage
                                fallback={"/alt-cryptosymbol.png"}
                                src={logoUrl}
                                alt={`${name} logo`}
                                width={96}
                                height={96}
                                className="rounded-full bg-white dark:bg-gray-800 p-1"
                            />
                        </div>
                    </div>
                </div>
                <CardContent className="pt-16 pb-6 px-6 flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{capitalize(name)}</h2>
                    {governedByOptimism &&
                        <Badge
                            variant="default"
                            className="bg-[#FF0421] text-white rounded-full"
                        >
                            Governed by Optimism
                        </Badge>
                    }
                </CardContent>
            </Card>
        </Link>
    )
}

