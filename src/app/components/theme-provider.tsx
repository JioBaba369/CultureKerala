
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { useConfig } from "@/hooks/use-config"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [config] = useConfig()

  return (
    <NextThemesProvider {...props}>
      <ThemeWrapper config={config}>{children}</ThemeWrapper>
    </NextThemesProvider>
  )
}


function ThemeWrapper({ children, config }: { children: React.ReactNode, config: any }) {
    const { theme: mode } = useTheme()
    const { colors } = config
    const activeColor = colors[mode === "dark" ? "dark" : "light"]

    React.useEffect(() => {
        const root = document.querySelector<HTMLHtmlElement>(":root");
        if (root) {
            if(activeColor.primary) root.style.setProperty("--theme-primary", activeColor.primary);
            if(activeColor.background) root.style.setProperty("--theme-background", activeColor.background);
            if(activeColor.accent) root.style.setProperty("--theme-accent", activeColor.accent);
        }
    }, [activeColor])

    return <>{children}</>
}
