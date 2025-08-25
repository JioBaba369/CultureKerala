
import { z } from "zod";

export const themes = [
    {
        name: "zinc",
        label: "Zinc",
        cssVars: {
            light: {
                background: "0 0% 100%",
                foreground: "240 10% 3.9%",
                card: "0 0% 100%",
                cardForeground: "240 10% 3.9%",
                popover: "0 0% 100%",
                popoverForeground: "240 10% 3.9%",
                primary: "240 5.9% 10%",
                primaryForeground: "0 0% 98%",
                secondary: "240 4.8% 95.9%",
                secondaryForeground: "240 5.9% 10%",
                muted: "240 4.8% 95.9%",
                mutedForeground: "240 3.8% 46.1%",
                accent: "240 4.8% 95.9%",
                accentForeground: "240 5.9% 10%",
                border: "240 5.9% 90%",
                input: "240 5.9% 90%",
                ring: "240 10% 3.9%",
                chart1: "240 5.9% 10%",
                chart2: "240 4.8% 95.9%",
                chart3: "240 3.8% 46.1%",
                chart4: "0 0% 98%",
                chart5: "240 5.9% 90%",
                sidebar: {
                    background: "240 5.9% 10%",
                    foreground: "0 0% 98%",
                    primary: "0 0% 98%",
                    primaryForeground: "240 5.9% 10%",
                    accent: "240 4.8% 95.9%",
                    accentForeground: "240 5.9% 10%",
                    border: "240 5.9% 90%",
                    ring: "240 10% 3.9%",
                }
            },
            dark: {
                background: "240 10% 3.9%",
                foreground: "0 0% 98%",
                card: "240 10% 3.9%",
                cardForeground: "0 0% 98%",
                popover: "240 10% 3.9%",
                popoverForeground: "0 0% 98%",
                primary: "0 0% 98%",
                primaryForeground: "240 5.9% 10%",
                secondary: "240 3.7% 15.9%",
                secondaryForeground: "0 0% 98%",
                muted: "240 3.7% 15.9%",
                mutedForeground: "240 5% 64.9%",
                accent: "240 3.7% 15.9%",
                accentForeground: "0 0% 98%",
                border: "240 3.7% 15.9%",
                input: "240 3.7% 15.9%",
                ring: "240 4.9% 83.9%",
                chart1: "0 0% 98%",
                chart2: "240 3.7% 15.9%",
                chart3: "240 5% 64.9%",
                chart4: "240 5.9% 10%",
                chart5: "240 4.9% 83.9%",
                sidebar: {
                    background: "240 10% 3.9%",
                    foreground: "0 0% 98%",
                    primary: "0 0% 98%",
                    primaryForeground: "240 5.9% 10%",
                    accent: "240 3.7% 15.9%",
                    accentForeground: "0 0% 98%",
                    border: "240 3.7% 15.9%",
                    ring: "240 4.9% 83.9%",
                }
            }
        }
    },
    {
        name: "violet",
        label: "Violet",
        cssVars: {
            light: {
                background: "287 100% 95%",
                foreground: "275 100% 15%",
                card: "0 0% 100%",
                cardForeground: "275 100% 15%",
                popover: "0 0% 100%",
                popoverForeground: "275 100% 15%",
                primary: "275 100% 25%",
                primaryForeground: "0 0% 100%",
                secondary: "274 100% 90%",
                secondaryForeground: "275 100% 25%",
                muted: "274 100% 95%",
                mutedForeground: "275 100% 40%",
                accent: "39 100% 50%",
                accentForeground: "0 0% 100%",
                border: "274 100% 90%",
                input: "274 100% 90%",
                ring: "274 100% 50%",
                chart1: "274 100% 50%",
                chart2: "287 100% 72%",
                chart3: "39 100% 50%",
                chart4: "275 100% 25%",
                chart5: "287 100% 85%",
                sidebar: {
                    background: "275 100% 10%",
                    foreground: "287 100% 90%",
                    primary: "287 100% 72%",
                    primaryForeground: "275 100% 10%",
                    accent: "275 100% 20%",
                    accentForeground: "287 100% 90%",
                    border: "275 100% 20%",
                    ring: "287 100% 72%",
                }
            },
            dark: {
                background: "275 100% 10%",
                foreground: "287 100% 90%",
                card: "275 100% 12%",
                cardForeground: "287 100% 90%",
                popover: "275 100% 10%",
                popoverForeground: "287 100% 90%",
                primary: "287 100% 72%",
                primaryForeground: "275 100% 10%",
                secondary: "275 100% 20%",
                secondaryForeground: "287 100% 90%",
                muted: "275 100% 20%",
                mutedForeground: "287 100% 80%",
                accent: "39 100% 50%",
                accentForeground: "0 0% 100%",
                border: "275 100% 20%",
                input: "275 100% 20%",
                ring: "287 100% 72%",
                chart1: "287 100% 72%",
                chart2: "274 100% 50%",
                chart3: "39 100% 50%",
                chart4: "275 100% 25%",
                chart5: "287 100% 85%",
                sidebar: {
                    background: "275 100% 10%",
                    foreground: "287 100% 90%",
                    primary: "287 100% 72%",
                    primaryForeground: "275 100% 10%",
                    accent: "275 100% 20%",
                    accentForeground: "287 100% 90%",
                    border: "275 100% 20%",
                    ring: "287 100% 72%",
                }
            }
        }
    }
] as const

export type Theme = (typeof themes)[number]["name"];

export const themeSchema = z.object({
  theme: z.enum(["violet", "zinc"]),
  colors: z.object({
    light: z.object({
      primary: z.string(),
      background: z.string(),
      accent: z.string(),
    }),
    dark: z.object({
      primary: z.string(),
      background: z.string(),
      accent: z.string(),
    }),
  }),
});

export type ThemeConfig = z.infer<typeof themeSchema>;

export const themeConfig: ThemeConfig = {
    theme: "violet",
    colors: {
        light: {
            primary: "275 100% 25%", // Indigo
            background: "287 100% 95%", // Light Heliotrope
            accent: "39 100% 50%", // Orange
        },
        dark: {
            primary: "287 100% 72%", // Heliotrope
            background: "275 100% 10%", // Dark Indigo
            accent: "39 100% 50%", // Orange
        }
    }
}
