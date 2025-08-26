
"use client"

import * as React from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { siteConfig } from "@/config/site"
import { themeConfig, themes } from "@/config/theme"
import type { SiteConfig } from "@/config/site"
import type { ThemeConfig } from "@/config/theme"

type Config = SiteConfig & Pick<ThemeConfig, "theme">;

const defaultConfig = {
    ...siteConfig,
    theme: "zinc" as const,
};

export function useSiteConfig() {
  const [config, setConfig] = useLocalStorage<Config>("config", defaultConfig);

  return [config, setConfig] as const;
}
