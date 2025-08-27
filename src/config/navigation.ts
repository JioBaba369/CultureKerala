
export type NavItem = {
    title: string;
    href: string;
    disabled?: boolean;
    items?: NavItem[];
    description?: string;
};

export type MainNavItem = NavItem;

type FooterNavSection = {
    title: string;
    items: NavItem[];
}

export type NavigationConfig = {
    mainNav: MainNavItem[];
    footerNav: FooterNavSection[];
};

export const navigationConfig: NavigationConfig = {
    mainNav: [
        {
            title: "Explore",
            href: "/explore",
        },
        {
            title: "Events",
            href: "/events",
        },
        {
            title: "Community",
            href: "/communities",
        },
        {
            title: "Businesses",
            href: "/businesses",
        },
        {
            title: "Classifieds",
            href: "/classifieds",
            items: [
                {
                    title: "For Sale",
                    href: "/classifieds?category=for_sale",
                    description: "Browse items for sale in the community.",
                },
                {
                    title: "Job Openings",
                    href: "/classifieds?category=job_opening",
                    description: "Find your next career opportunity.",
                },
                {
                    title: "Services",
                    href: "/classifieds?category=service",
                    description: "Discover services offered by community members.",
                },
                 {
                    title: "Other",
                    href: "/classifieds?category=other",
                    description: "View all other classified listings.",
                },
            ]
        },
    ],
    footerNav: [
        {
            title: "Discover",
            items: [
                {
                    title: "Explore",
                    href: "/explore",
                },
                {
                    title: "Events",
                    href: "/events",
                },
                {
                    title: "Communities",
                    href: "/communities",
                },
                {
                    title: "Businesses",
                    href: "/businesses",
                },
                 {
                    title: "Classifieds",
                    href: "/classifieds",
                },
            ]
        },
        {
            title: "Company",
            items: [
                {
                    title: "About Us",
                    href: "/about",
                },
                {
                    title: "Contact",
                    href: "/contact",
                }
            ]
        },
        {
            title: "Legal",
            items: [
                {
                    title: "Terms of Service",
                    href: "/terms",
                },
                {
                    title: "Privacy Policy",
                    href: "/privacy",
                }
            ]
        }
    ]
};
