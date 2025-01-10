import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
      {children}
    </h1>
  );
}

export function Subtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("mt-8 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0", className)}>
      {children}
    </h2>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("mt-4 scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function Paragraph({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>{children}</p>;
}

export function Anchor({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn("font-medium text-primary underline underline-offset-4", className)}
    >
      {children}
    </a>
  );
}

export function Blockquote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>{children}</blockquote>
  );
}

export function UnorderedList({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>{children}</ul>;
}

export function ListItem({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={cn("", className)}>{children}</li>;
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("my-6 w-full overflow-y-auto", className)}><table className="w-full">{children}</table></div>;
}

export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <thead className={cn("", className)}>{children}</thead>;
}

export function TableBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={cn("", className)}>{children}</tbody>;
}

export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn("m-0 border-t p-0 even:bg-muted", className)}>{children}</tr>;
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={cn("border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right", className)}>
      {children}
    </td>
  );
}
