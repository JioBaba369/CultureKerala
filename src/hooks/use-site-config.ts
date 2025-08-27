
import { siteConfig } from "@/config/site"
import type { SiteConfig } from "@/config/site"

export function useSiteConfig() {
  return [siteConfig, () => {}] as const;
}
