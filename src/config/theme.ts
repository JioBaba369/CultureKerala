
import { z } from "zod";

export const themes = [
    {
        name: "orange",
        label: "Culture Kerala",
        cssVars: {
            light: {
                background: "45 56% 90%", // Sandal
                foreground: "0 0% 7%", // Black Pepper
                card: "0 0% 100%",
                cardForeground: "0 0% 7%",
                popover: "0 0% 100%",
                popoverForeground: "0 0% 7%",
                primary: "221 83% 53%", // Boat-Race Blue
                primaryForeground: "0 0% 100%", // White
                secondary: "240 4.8% 95.9%",
                secondaryForeground: "240 5.9% 10%",
                muted: "240 4.8% 95.9%",
                mutedForeground: "240 3.8% 46.1%",
                accent: "135 53% 39%", // Kerala Green
                accentForeground: "0 0% 100%",
                border: "45 20% 80%",
                input: "45 20% 80%",
                ring: "221 83% 53%",
                chart1: "221 83% 53%",
                chart2: "135 53% 39%",
                chart3: "45 56% 90%",
                chart4: "240 5.9% 10%",
                chart5: "240 4.8% 95.9%",
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
                background: "0 0% 7%", // Black Pepper
                foreground: "0 0% 98%", // White
                card: "0 0% 10%",
                cardForeground: "0 0% 98%",
                popover: "0 0% 7%",
                popoverForeground: "0 0% 98%",
                primary: "221 83% 53%", // Boat-Race Blue
                primaryForeground: "0 0% 100%",
                secondary: "240 3.7% 15.9%",
                secondaryForeground: "0 0% 98%",
                muted: "240 3.7% 15.9%",
                mutedForeground: "240 5% 64.9%",
                accent: "135 53% 39%", // Kerala Green
                accentForeground: "0 0% 100%",
                border: "240 3.7% 15.9%",
                input: "240 3.7% 15.9%",
                ring: "221 83% 53%",
                chart1: "221 83% 53%",
                chart2: "135 53% 39%",
                chart3: "45 56% 90%",
                chart4: "0 0% 98%",
                chart5: "240 3.7% 15.9%",
                sidebar: {
                    background: "0 0% 7%",
                    foreground: "0 0% 98%",
                    primary: "0 0% 98%",
                    primaryForeground: "0 0% 7%",
                    accent: "240 3.7% 15.9%",
                    accentForeground: "0 0% 98%",
                    border: "240 3.7% 15.9%",
                    ring: "221 83% 53%",
                }
            }
        }
    }
] as const;

export type Theme = (typeof themes)[number]["name"];

export const themeSchema = z.object({
  theme: z.enum(["orange"]),
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
