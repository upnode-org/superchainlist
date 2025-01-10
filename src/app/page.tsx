import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AggregatedData, Superchain } from "@/utils/generateChainData";
import Link from "next/link";
import IconImage from "@/components/IconImage";
import { Title } from "@/components/Typography"
import Container from "@/components/Container";

async function fetchChainData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chains`
    , { next: { revalidate: 43200 }, } // 12 hour cache
  );

  return res.json()
}

export default async function Home() {
  // const chainlist = await fetchChainData()
  const chainlist: AggregatedData[] = await fetchChainData()
  // const sorted = chainlist.sort((a,b) => {
  // })
  console.log(chainlist);



  return (
    <Container>
      <div className="items-center justify-items-center min-h-screen size-full">
        <main className="flex h-full flex-col gap-8  items-center sm:items-start w-full">
          {/* Hero */}
          <div className="bg-[#ff0421] text-white size-full rounded-2xl p-4 h-40 flex flex-col justify-between">
            <Title className="mb-2 font-extralight">Superchain Registry</Title>
            <button className="bg-black w-fit px-4 py-2 ml-auto">Something &gt;</button>
          </div>
          {/* Main Body */}
          <div className="size-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {chainlist.map((chain: AggregatedData) => {
                return (
                  <Link href={`/chain/${chain.main.chainId}`}>
                    <Card className="relative hover:scale-[101%] hover:shadow-xl transition-transform overflow-hidden">
                      <CardHeader className="flex !flex-row justify-between relative -mt-0.5 z-10">
                        <div className="max-w-fit">
                          <CardTitle className="flex justify-between">{chain.main.name}</CardTitle>
                          <CardDescription>{chain.main.identifier}</CardDescription>
                        </div>
                        <IconImage iconParam={chain.main.icon} size={36} />
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </Container>
  );
}
