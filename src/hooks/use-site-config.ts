
"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { siteConfig } from "@/config/site"
import { themeConfig } from "@/config/theme"
import type { SiteConfig } from "@/config/site"
import type { ThemeConfig } from "@/config/theme"

type Config = SiteConfig & ThemeConfig

export function useSiteConfig() {
  return useLocalStorage<Config>("config", {
    ...siteConfig,
    ...themeConfig
  })
}
