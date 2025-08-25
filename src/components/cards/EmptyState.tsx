
import { ServerCrash } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function EmptyState({
    title,
    description,
    link,
    linkText
}: {
    title: string;
    description: string;
    link?: string;
    linkText?: string;
}) {
    return (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
            <ServerCrash className="mx-auto h-12 w-12" />
            <h3 className="font-headline text-2xl mt-4">{title}</h3>
            <p>{description}</p>
            {link && linkText && (
                <Button asChild className="mt-4">
                    <Link href={link}>{linkText}</Link>
                </Button>
            )}
        </div>
    );
}
