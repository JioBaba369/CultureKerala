
"use client"

import * as React from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { siteConfig } from "@/config/site"
import { themeConfig, themes } from "@/config/theme"
import type { SiteConfig } from "@/config/site"
import type { ThemeConfig } from "@/config/theme"

type Config = SiteConfig & Pick<ThemeConfig, "theme">;

export function useSiteConfig() {
  const [config, setConfig] = useLocalStorage<Config>("config", {
    ...siteConfig,
    theme: themeConfig.theme,
  });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const clientConfig = { ...siteConfig, ...config };

  return [mounted ? clientConfig : siteConfig, setConfig] as const;
}
