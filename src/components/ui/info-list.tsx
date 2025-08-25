
import { cn } from "@/lib/utils";
import React from "react";

export const InfoList = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <ul className={cn("space-y-3", className)}>
            {children}
        </ul>
    );
}

export const InfoListItem = ({ label, children }: { label: string, children: React.ReactNode }) => {
    return (
        <li className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{children}</span>
        </li>
    )
}
