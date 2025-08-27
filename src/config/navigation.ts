
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
            title: "Kerala",
            href: "/kerala",
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
            title: "More",
            href: "",
            items: [
                {
                    title: "Classifieds",
                    href: "/classifieds",
                    description: "Find jobs, items for sale, and services in the community.",
                },
                {
                    title: "Deals",
                    href: "/deals",
                    description: "Find exclusive deals from local businesses.",
                },
                {
                    title: "Movies",
                    href: "/movies",
                    description: "Discover movie screenings and showtimes.",
                }
            ]
        }
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
                    title: "Kerala",
                    href: "/kerala",
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
