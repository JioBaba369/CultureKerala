
import { z } from "zod"
import { themeSchema } from "./theme";

const siteConfigSchema = z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    ogImage: z.string(),
    links: z.object({
        x: z.string().url(),
        github: z.string().url(),
        facebook: z.string().url(),
        instagram: z.string().url(),
        linkedin: z.string().url(),
    }),
    tagline: z.string(),
    mission: z.string(),
    vision: z.string(),
    meta: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
    }),
    abTests: z.object({
        homePageTagline: z.object({
            a: z.string(),
            b: z.string(),
        })
    })
});

export type SiteConfig = z.infer<typeof siteConfigSchema>

export const siteConfig: SiteConfig = {
    name: "DilSePass",
    description: "Your global guide to Indian culture, events, and community. Discover local happenings and connect with Indians worldwide.",
    url: "https://dilsepass.com",
    ogImage: "https://dilsepass.com/og/home-og.png",
    links: {
        x: "https://x.com/dilsepass",
        github: "https://github.com/your-org/dilsepass",
        facebook: "https://facebook.com/dilsepass",
        instagram: "https://instagram.com/dilsepass",
        linkedin: "https://linkedin.com/company/dilsepass",
    },
    tagline: "Connecting India's Culture, Worldwide.",
    mission: "To unite the global Indian diaspora by providing a central platform to discover cultural events, support local businesses, and foster meaningful connections.",
    vision: "To be the digital town square for Indians everywhere, a place where tradition is celebrated, language is cherished, and the spirit of India thrives across borders.",
    meta: {
        title: "DilSePass — Connecting India's Culture, Worldwide.",
        description: "Discover Indian events, connect with your community, and support local Indian businesses—DilSePass is the digital home for the diaspora.",
        keywords: ["india", "indian", "events", "community", "local business", "culture", "diwali", "holi"],
    },
    abTests: {
        homePageTagline: {
            a: "The digital home for the global Indian.",
            b: "Connecting India's Culture, Worldwide."
        }
    }
};

