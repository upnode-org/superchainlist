"use client"
import { useChains } from "@/context/ChainContext";
import { Filter, SearchIcon } from "lucide-react";

export default function Search() {
    const { setSearchQuery, searchQuery } = useChains()

    return (
        <div className="w-full flex h-7 border rounded-lg">
            <button className="bg-gray-200 rounded-l-lg px-2.5">
                < Filter className="size-4" />
            </button>
            <div className="w-full flex items-center group focus-within:ring-2 focus-within:ring-blue-500 rounded-r-lg">
                <button className="bg-white px-2.5 h-full"><SearchIcon className="size-4 " /></button>
                <input 
                className=" size-full rounded-r-lg outline-none text-md" 
                placeholder="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                />
            </div>
        </div>
    )
}