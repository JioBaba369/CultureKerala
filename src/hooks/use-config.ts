
"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { siteConfig, siteConfigSchema } from "@/config/site"
import type { SiteConfig } from "@/config/site"

export function useConfig() {
  return useLocalStorage<SiteConfig>("config", siteConfigSchema.parse(siteConfig))
}
