
"use client"

import { useTheme } from "next-themes"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { themeConfig, themeSchema } from "@/config/theme"
import type { ThemeConfig } from "@/config/theme"

export function useConfig() {
  return useLocalStorage<ThemeConfig>("config", themeSchema.parse(themeConfig))
}
