
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
            title: "Communities",
            href: "/communities",
        },
        {
            title: "Businesses",
            href: "/businesses",
        },
        {
            title: "Deals",
            href: "/deals",
        },
        {
            title: "Movies",
            href: "/movies",
        },
        {
            title: "Classifieds",
            href: "/classifieds",
        },
        {
            title: "About Kerala",
            href: "/kerala",
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
                 {
                    title: "Perks",
                    href: "/perks",
                },
            ]
        },
        {
            title: "Learn",
            items: [
                 {
                    title: "About Kerala",
                    href: "/kerala",
                },
                {
                    title: "Learn Malayalam",
                    href: "/learn",
                }
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
                },
                {
                    title: "Emergency Contacts",
                    href: "/emergency-contacts",
                },
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
