
"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { siteConfig } from "@/config/site"
import type { SiteConfig } from "@/config/site"

export function useSiteConfig() {
  const [config, setConfig] = useLocalStorage<SiteConfig>("siteConfig", siteConfig)

  return [config, setConfig] as const
}

    