
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { useConfig } from "@/hooks/use-config"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [config] = useConfig()

  return (
    <NextThemesProvider {...props}>
      <>{children}</>
       <ThemeWrapper config={config} />
    </NextThemesProvider>
  )
}


function ThemeWrapper({ config }: { config: any }) {
    const { theme: mode } = useTheme()
    const { theme, colors } = config
    const activeColor = colors[mode === "dark" ? "dark" : "light"]

    React.useEffect(() => {
        const root = document.querySelector<HTMLHtmlElement>(":root");
        if (root) {
            root.style.setProperty("--theme-primary", activeColor.primary);
            root.style.setProperty("--theme-background", activeColor.background);
            root.style.setProperty("--theme-accent", activeColor.accent);
        }
    }, [activeColor])

    return null
}

// Custom hook to get the theme from next-themes
function useTheme() {
    const context = React.useContext(NextThemesProvider)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
