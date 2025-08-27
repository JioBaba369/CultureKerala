
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { useSiteConfig } from "@/hooks/use-site-config"
import { themes } from "@/config/theme"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
        <ThemeWrapper>{children}</ThemeWrapper>
    </NextThemesProvider>
  )
}


export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme: mode } = useTheme()
    const [config] = useSiteConfig()
    
    const theme = themes.find((t) => t.name === config.theme) || themes[0]
    const colors = config.colors;

    React.useEffect(() => {
        const root = document.documentElement;

        root.style.setProperty('--theme-background', colors.light.background);
        root.style.setProperty('--theme-foreground', theme.cssVars.light.foreground);
        root.style.setProperty('--theme-card', theme.cssVars.light.card);
        root.style.setProperty('--theme-card-foreground', theme.cssVars.light.cardForeground);
        root.style.setProperty('--theme-popover', theme.cssVars.light.popover);
        root.style.setProperty('--theme-popover-foreground', theme.cssVars.light.popoverForeground);
        root.style.setProperty('--theme-primary', colors.light.primary);
        root.style.setProperty('--theme-primary-foreground', theme.cssVars.light.primaryForeground);
        root.style.setProperty('--theme-secondary', theme.cssVars.light.secondary);
        root.style.setProperty('--theme-secondary-foreground', theme.cssVars.light.secondaryForeground);
        root.style.setProperty('--theme-muted', theme.cssVars.light.muted);
        root.style.setProperty('--theme-muted-foreground', theme.cssVars.light.mutedForeground);
        root.style.setProperty('--theme-accent', colors.light.accent);
        root.style.setProperty('--theme-accent-foreground', theme.cssVars.light.accentForeground);
        root.style.setProperty('--theme-border', theme.cssVars.light.border);
        root.style.setProperty('--theme-input', theme.cssVars.light.input);
        root.style.setProperty('--theme-ring', theme.cssVars.light.ring);
        root.style.setProperty('--theme-chart-1', theme.cssVars.light.chart1);
        root.style.setProperty('--theme-chart-2', theme.cssVars.light.chart2);
        root.style.setProperty('--theme-chart-3', theme.cssVars.light.chart3);
        root.style.setProperty('--theme-chart-4', theme.cssVars.light.chart4);
        root.style.setProperty('--theme-chart-5', theme.cssVars.light.chart5);
        root.style.setProperty('--theme-sidebar-background', theme.cssVars.light.sidebar.background);
        root.style.setProperty('--theme-sidebar-foreground', theme.cssVars.light.sidebar.foreground);
        root.style.setProperty('--theme-sidebar-primary', theme.cssVars.light.sidebar.primary);
        root.style.setProperty('--theme-sidebar-primary-foreground', theme.cssVars.light.sidebar.primaryForeground);
        root.style.setProperty('--theme-sidebar-accent', theme.cssVars.light.sidebar.accent);
        root.style.setProperty('--theme-sidebar-accent-foreground', theme.cssVars.light.sidebar.accentForeground);
        root.style.setProperty('--theme-sidebar-border', theme.cssVars.light.sidebar.border);
        root.style.setProperty('--theme-sidebar-ring', theme.cssVars.light.sidebar.ring);

        root.style.setProperty('--dark-theme-background', colors.dark.background);
        root.style.setProperty('--dark-theme-foreground', theme.cssVars.dark.foreground);
        root.style.setProperty('--dark-theme-card', theme.cssVars.dark.card);
        root.style.setProperty('--dark-theme-card-foreground', theme.cssVars.dark.cardForeground);
        root.style.setProperty('--dark-theme-popover', theme.cssVars.dark.popover);
        root.style.setProperty('--dark-theme-popover-foreground', theme.cssVars.dark.popoverForeground);
        root.style.setProperty('--dark-theme-primary', colors.dark.primary);
        root.style.setProperty('--dark-theme-primary-foreground', theme.cssVars.dark.primaryForeground);
        root.style.setProperty('--dark-theme-secondary', theme.cssVars.dark.secondary);
        root.style.setProperty('--dark-theme-secondary-foreground', theme.cssVars.dark.secondaryForeground);
        root.style.setProperty('--dark-theme-muted', theme.cssVars.dark.muted);
        root.style.setProperty('--dark-theme-muted-foreground', theme.cssVars.dark.mutedForeground);
        root.style.setProperty('--dark-theme-accent', colors.dark.accent);
        root.style.setProperty('--dark-theme-accent-foreground', theme.cssVars.dark.accentForeground);
        root.style.setProperty('--dark-theme-border', theme.cssVars.dark.border);
        root.style.setProperty('--dark-theme-input', theme.cssVars.dark.input);
        root.style.setProperty('--dark-theme-ring', theme.cssVars.dark.ring);
        root.style.setProperty('--dark-theme-chart-1', theme.cssVars.dark.chart1);
        root.style.setProperty('--dark-theme-chart-2', theme.cssVars.dark.chart2);
        root.style.setProperty('--dark-theme-chart-3', theme.cssVars.dark.chart3);
        root.style.setProperty('--dark-theme-chart-4', theme.cssVars.dark.chart4);
        root.style.setProperty('--dark-theme-chart-5', theme.cssVars.dark.chart5);
        root.style.setProperty('--dark-theme-sidebar-background', theme.cssVars.dark.sidebar.background);
        root.style.setProperty('--dark-theme-sidebar-foreground', theme.cssVars.dark.sidebar.foreground);
        root.style.setProperty('--dark-theme-sidebar-primary', theme.cssVars.dark.sidebar.primary);
        root.style.setProperty('--dark-theme-sidebar-primary-foreground', theme.cssVars.dark.sidebar.primaryForeground);
        root.style.setProperty('--dark-theme-sidebar-accent', theme.cssVars.dark.sidebar.accent);
        root.style.setProperty('--dark-theme-sidebar-accent-foreground', theme.cssVars.dark.sidebar.accentForeground);
        root.style.setProperty('--dark-theme-sidebar-border', theme.cssVars.dark.sidebar.border);
        root.style.setProperty('--dark-theme-sidebar-ring', theme.cssVars.dark.sidebar.ring);

    }, [theme, colors])

    return <>{children}</>
}

    