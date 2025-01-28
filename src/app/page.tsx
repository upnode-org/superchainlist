import { AggregatedData, Superchain } from "@/lib/generateChainData";
import { Title } from "@/components/Typography"
import Container from "@/components/Container";
import ChainGrid from "@/components/ChainGrid";

async function fetchChainData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chains`
    // , { next: { revalidate: 43200 }, } // 12 hour cache
  );

  return res.json()
}

export default async function Home() {
  // const chainlist = await fetchChainData()
  const chainlist: AggregatedData[] = await fetchChainData()
  // const sorted = chainlist.sort((a,b) => {
  // })
  // console.log(chainlist);

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
          <ChainGrid chains={chainlist} />
        </main>
      </div>
    </Container>
  );
}