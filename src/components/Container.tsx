import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Container({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn(
                "container mx-auto p-4 overflow-auto",
                className
            )}
        >
            {children}
        </section>
    );
}
