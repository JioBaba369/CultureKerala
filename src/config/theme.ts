
import { z } from "zod";

export const themes = [
    {
        name: "orange",
        label: "Orange",
    },
    {
        name: "zinc",
        label: "Zinc",
    },
    {
        name: "slate",
        label: "Slate",
    },
    {
        name: "stone",
        label: "Stone",
    },
    {
        name: "gray",
        label: "Gray",
    },
    {
        name: "neutral",
        label: "Neutral",
    },
    {
        name: "red",
        label: "Red",
    },
    {
        name: "rose",
        label: "Rose",
    },
    {
        name: "green",
        label: "Green",
    },
    {
        name: "blue",
        label: "Blue",
    },
    {
        name: "yellow",
        label: "Yellow",
    },
    {
        name: "violet",
        label: "Violet",
    },
] as const

export const themeSchema = z.object({
  theme: z.enum(["orange", "zinc", "slate", "stone", "gray", "neutral", "red", "rose", "green", "blue", "yellow", "violet"]),
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
    theme: "orange",
    colors: {
        light: {
            primary: "36 100% 60%", // Saffron
            background: "60 56% 91%", // Light Beige
            accent: "180 100% 25%", // Deep Teal
        },
        dark: {
            primary: "36 100% 60%", // Saffron
            background: "222.2 84% 4.9%", // Default dark
            accent: "180 100% 35%", // Lighter Deep Teal for dark mode
        }
    }
}
