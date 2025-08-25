
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { useSiteConfig } from "@/hooks/use-site-config"


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
        {children}
    </NextThemesProvider>
  )
}


export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme: mode } = useTheme()
    const [config] = useSiteConfig()
    const { colors } = config
    const activeColor = colors[mode === "dark" ? "dark" : "light"]

    React.useEffect(() => {
        const root = document.querySelector<HTMLHtmlElement>(":root");
        if (root) {
            root.style.setProperty("--theme-primary-fg", activeColor.primary);
            root.style.setProperty("--theme-background", activeColor.background);
            root.style.setProperty("--theme-accent", activeColor.accent);

             // This is a bit of a hack to get the HSL values for the primary color
            const primaryColor = activeColor.primary.split(" ");
            const primaryBg = `${primaryColor[0]} ${primaryColor[1]}`
            root.style.setProperty("--theme-primary", primaryBg);

            // This is needed for ShadCN colors
            root.style.setProperty("--primary", primaryBg);
            root.style.setProperty("--background", activeColor.background);
            root.style.setProperty("--accent", activeColor.accent);

        }
    }, [activeColor, mode])

    return <>{children}</>
}
