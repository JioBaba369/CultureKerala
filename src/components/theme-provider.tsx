
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { useSiteConfig } from "@/hooks/use-site-config"
import { themes } from "@/config/theme"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const [config] = useSiteConfig()
    const theme = themes.find((t) => t.name === config.theme) || themes[0]
    const colors = config.colors;
    
    return (
    <NextThemesProvider {...props}>
        <style
        dangerouslySetInnerHTML={{
            __html: `
            :root {
                --theme-background: ${colors.light.background};
                --theme-foreground: ${theme.cssVars.light.foreground};
                --theme-card: ${theme.cssVars.light.card};
                --theme-card-foreground: ${theme.cssVars.light.cardForeground};
                --theme-popover: ${theme.cssVars.light.popover};
                --theme-popover-foreground: ${theme.cssVars.light.popoverForeground};
                --theme-primary: ${colors.light.primary};
                --theme-primary-foreground: ${theme.cssVars.light.primaryForeground};
                --theme-secondary: ${theme.cssVars.light.secondary};
                --theme-secondary-foreground: ${theme.cssVars.light.secondaryForeground};
                --theme-muted: ${theme.cssVars.light.muted};
                --theme-muted-foreground: ${theme.cssVars.light.mutedForeground};
                --theme-accent: ${colors.light.accent};
                --theme-accent-foreground: ${theme.cssVars.light.accentForeground};
                --theme-border: ${theme.cssVars.light.border};
                --theme-input: ${theme.cssVars.light.input};
                --theme-ring: ${theme.cssVars.light.ring};
                --theme-chart-1: ${theme.cssVars.light.chart1};
                --theme-chart-2: ${theme.cssVars.light.chart2};
                --theme-chart-3: ${theme.cssVars.light.chart3};
                --theme-chart-4: ${theme.cssVars.light.chart4};
                --theme-chart-5: ${theme.cssVars.light.chart5};
                --theme-sidebar-background: ${theme.cssVars.light.sidebar.background};
                --theme-sidebar-foreground: ${theme.cssVars.light.sidebar.foreground};
                --theme-sidebar-primary: ${theme.cssVars.light.sidebar.primary};
                --theme-sidebar-primary-foreground: ${theme.cssVars.light.sidebar.primaryForeground};
                --theme-sidebar-accent: ${theme.cssVars.light.sidebar.accent};
                --theme-sidebar-accent-foreground: ${theme.cssVars.light.sidebar.accentForeground};
                --theme-sidebar-border: ${theme.cssVars.light.sidebar.border};
                --theme-sidebar-ring: ${theme.cssVars.light.sidebar.ring};
            }

            .dark {
                --dark-theme-background: ${colors.dark.background};
                --dark-theme-foreground: ${theme.cssVars.dark.foreground};
                --dark-theme-card: ${theme.cssVars.dark.card};
                --dark-theme-card-foreground: ${theme.cssVars.dark.cardForeground};
                --dark-theme-popover: ${theme.cssVars.dark.popover};
                --dark-theme-popover-foreground: ${theme.cssVars.dark.popoverForeground};
                --dark-theme-primary: ${colors.dark.primary};
                --dark-theme-primary-foreground: ${theme.cssVars.dark.primaryForeground};
                --dark-theme-secondary: ${theme.cssVars.dark.secondary};
                --dark-theme-secondary-foreground: ${theme.cssVars.dark.secondaryForeground};
                --dark-theme-muted: ${theme.cssVars.dark.muted};
                --dark-theme-muted-foreground: ${theme.cssVars.dark.mutedForeground};
                --dark-theme-accent: ${colors.dark.accent};
                --dark-theme-accent-foreground: ${theme.cssVars.dark.accentForeground};
                --dark-theme-border: ${theme.cssVars.dark.border};
                --dark-theme-input: ${theme.cssVars.dark.input};
                --dark-theme-ring: ${theme.cssVars.dark.ring};
                --dark-theme-chart-1: ${theme.cssVars.dark.chart1};
                --dark-theme-chart-2: ${theme.cssVars.dark.chart2};
                --dark-theme-chart-3: ${theme.cssVars.dark.chart3};
                --dark-theme-chart-4: ${theme.cssVars.dark.chart4};
                --dark-theme-chart-5: ${theme.cssVars.dark.chart5};
                --dark-theme-sidebar-background: ${theme.cssVars.dark.sidebar.background};
                --dark-theme-sidebar-foreground: ${theme.cssVars.dark.sidebar.foreground};
                --dark-theme-sidebar-primary: ${theme.cssVars.dark.sidebar.primary};
                --dark-theme-sidebar-primary-foreground: ${theme.cssVars.dark.sidebar.primaryForeground};
                --dark-theme-sidebar-accent: ${theme.cssVars.dark.sidebar.accent};
                --dark-theme-sidebar-accent-foreground: ${theme.cssVars.dark.sidebar.accentForeground};
                --dark-theme-sidebar-border: ${theme.cssVars.dark.sidebar.border};
                --dark-theme-sidebar-ring: ${theme.cssVars.dark.sidebar.ring};
            }
            `,
        }}
        />
        {children}
    </NextThemesProvider>
  )
}
