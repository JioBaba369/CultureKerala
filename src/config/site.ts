
import { z } from "zod"

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
    description: "Discover events, connect with your community, and support local businesses on a single, trusted platform.",
    url: "https://dilsepass.com",
    ogImage: "https://dilsepass.com/og/home-og.png",
    links: {
        x: "https://x.com/dilsepass",
        github: "https://github.com/your-org/dilsepass",
        facebook: "https://facebook.com/dilsepass",
        instagram: "https://instagram.com/dilsepass",
        linkedin: "https://linkedin.com/company/dilsepass",
    },
    tagline: "Your Community, Connected.",
    mission: "To unite and uplift communities by making it effortless to discover cultural events, build real connections, and support local businesses—all on one trusted platform.",
    vision: "A world where every member of the community feels at home, anywhere. This is the digital town square where traditions thrive, friendships spark, and opportunity flows.",
    meta: {
        title: "Dil Se Pass — Your Community, Connected.",
        description: "Discover events, connect with community, and support local businesses—DilSePass is the digital home for your community.",
        keywords: ["diaspora", "indian", "events", "community", "local business", "culture", "south asian"],
    },
    abTests: {
        homePageTagline: {
            a: "The digital home for the Indian diaspora.",
            b: "Your Community, Connected."
        }
    }
};
