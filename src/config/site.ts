
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
}).merge(themeSchema);

export type SiteConfig = z.infer<typeof siteConfigSchema>

export const siteConfig: SiteConfig = {
    name: "Culture Kerala",
    description: "Your global guide to Malayalee culture, events, and community. Discover local happenings and connect with Keralites worldwide.",
    url: "https://culturekerala.com",
    ogImage: "https://culturekerala.com/og/home-og.png",
    links: {
        x: "https://x.com/culturekerala",
        github: "https://github.com/your-org/culture-kerala",
        facebook: "https://facebook.com/culturekerala",
        instagram: "https://instagram.com/culturekerala",
        linkedin: "https://linkedin.com/company/culturekerala",
    },
    tagline: "Connecting Kerala's Culture, Worldwide.",
    mission: "To unite the global Malayalee community by providing a central platform to discover cultural events, support local businesses, and foster meaningful connections.",
    vision: "To be the digital town square for Keralites everywhere, a place where tradition is celebrated, language is cherished, and the spirit of Kerala thrives across borders.",
    meta: {
        title: "Culture Kerala — Connecting Kerala's Culture, Worldwide.",
        description: "Discover Malayalee events, connect with your community, and support local Keralite businesses—Culture Kerala is the digital home for Malayalees.",
        keywords: ["kerala", "malayalee", "malayalam", "events", "community", "local business", "culture", "onam", "vishu", "kathakali"],
    },
    abTests: {
        homePageTagline: {
            a: "The digital home for the global Malayalee.",
            b: "Connecting Kerala's Culture, Worldwide."
        }
    },
    theme: "orange",
    colors: {
        light: {
            primary: "221 83% 53%", // Boat-Race Blue #1F6FEB
            background: "45 56% 90%", // Sandal #F3E9D2
            accent: "135 53% 39%", // Kerala Green #2B8A3E
        },
        dark: {
            primary: "221 83% 53%", // Boat-Race Blue #1F6FEB
            background: "0 0% 7%", // Black Pepper #111111
            accent: "135 53% 39%", // Kerala Green #2B8A3E
        }
    }
};
