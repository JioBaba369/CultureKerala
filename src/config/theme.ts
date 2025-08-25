
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
