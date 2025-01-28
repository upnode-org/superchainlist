import { NextResponse } from "next/server";
import { generateChainData } from "@/lib/generateChainData";

export async function GET() {
  try {
    const data = await generateChainData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching chain data:", error);
    return NextResponse.json({ error: "Failed to fetch chain data." }, { status: 500 });
  }
}