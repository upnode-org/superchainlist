import Link from "next/link";

export default function NavBar() {
    return (
        <>
        <div className="fixed top-0 z-50 w-full bg-white border-b text-black">
            <nav className="container mx-auto p-4 flex justify-between ">
                <Link href={"/"}>
                    Superchain Registry
                </Link>
                <div>
                    Search
                </div>
            </nav>
        </div>
        {/* Trick to make sure main content isnt covered by nav*/}
        <div className="h-14"/>
        </>
    )
}