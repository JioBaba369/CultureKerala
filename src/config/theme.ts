
import { z } from "zod";

export const themes = [
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
        name: "orange",
        label: "Orange",
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
  theme: z.enum(["zinc", "slate", "stone", "gray", "neutral", "red", "rose", "orange", "green", "blue", "yellow", "violet"]),
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
    theme: "zinc",
    colors: {
        light: {
            primary: "262 80% 58%",
            background: "0 0% 100%",
            accent: "36 100% 50%",
        },
        dark: {
            primary: "262 80% 58%",
            background: "224 71% 4%",
            accent: "36 100% 50%",
        }
    }
}
