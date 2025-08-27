export type NavItem = {
    title: string;
    href: string;
    disabled?: boolean;
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
