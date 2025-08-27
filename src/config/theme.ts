
import { z } from "zod";

export const themes = [
    {
        name: "orange",
        label: "DilSePass",
    }
] as const;

export type Theme = (typeof themes)[number]["name"];

export const themeSchema = z.object({
  theme: z.enum(["orange"]),
});

export type ThemeConfig = z.infer<typeof themeSchema>;
