
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
        whatsapp: z.string().url(),
    }),
    tagline: z.string(),
    mission: z.string(),
    vision: z.string(),
    meta: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
    })
});

export type SiteConfig = z.infer<typeof siteConfigSchema>

export const siteConfig: SiteConfig = {
    name: "Culture Kerala",
    description: "Discover events, connect with your community, and support local businesses—Culture Kerala is the digital home for the Malayalee diaspora.",
    url: "https://culturekerala.com",
    ogImage: "https://firebasestorage.googleapis.com/v0/b/culture-kerala.appspot.com/o/og%2Fhome-og.png?alt=media&token=c2763404-5e13-4315-8854-e7b8e5c3e795",
    links: {
        x: "https://x.com/culturekerala",
        github: "https://github.com/your-org/culturekerala",
        facebook: "https://facebook.com/culturekerala",
        instagram: "https://instagram.com/culturekerala",
        linkedin: "https://linkedin.com/company/culturekerala",
        whatsapp: "https://whatsapp.com/channel/your-channel-id",
    },
    tagline: "Your Community, Connected.",
    mission: "To unite the global Malayalee diaspora by providing a central platform to discover cultural events, support local businesses, and foster meaningful connections.",
    vision: "To be the digital town square for Malayalees everywhere, a place where tradition is celebrated, language is cherished, and the spirit of Kerala thrives across borders.",
    meta: {
        title: "Culture Kerala — Connecting Kerala's Culture, Worldwide.",
        description: "Discover events, connect with your community, and support local businesses—Culture Kerala is the digital home for the Malayalee diaspora.",
        keywords: ["kerala", "malayalee", "malayalam", "events", "community", "local business", "culture", "onam", "thrissur pooram"],
    }
};

