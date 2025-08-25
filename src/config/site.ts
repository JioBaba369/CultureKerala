
export type SiteConfig = {
    name: string;
    description: string;
    url: string;
    ogImage: string;
    links: {
        twitter: string;
        github: string;
    };
};

export const siteConfig: SiteConfig = {
    name: "DilSePass",
    description: "Your guide to local events, communities, and more in the South Asian diaspora.",
    url: "https://dilsepass.com",
    ogImage: "https://dilsepass.com/og/home-og.png",
    links: {
        twitter: "https://twitter.com/dilsepass",
        github: "https://github.com/your-org/dilsepass",
    },
};
