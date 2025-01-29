import { Title } from "@/components/Typography"
import Container from "@/components/Container";
import ChainGrid from "@/components/ChainGrid";
import Search from "@/components/Search";

export default async function Home() {
  return (
    <Container>
      <div className="items-center justify-items-center min-h-screen size-full">
        <main className="flex h-full flex-col gap-4  items-center sm:items-start w-full">
          {/* Hero */}
          <div className="bg-[#ff0421] text-white size-full rounded-2xl p-4 h-40 flex flex-col justify-between my-1">
            <Title className="mb-2 font-extralight">Superchain Registry</Title>
            <button className="bg-black w-fit px-4 py-2 ml-auto">Something &gt;</button>
          </div>
          {/* Main Body */}
          <Search />
          <ChainGrid/>
        </main>
      </div>
    </Container>
  );
}