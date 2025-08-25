
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
            title: "Home",
            href: "/",
        },
        {
            title: "Explore",
            href: "/explore",
        },
        {
            title: "Events",
            href: "/events",
        },
        {
            title: "Deals",
            href: "/deals",
        },
        {
            title: "About",
            href: "/about",
        },
    ],
    footerNav: [
        {
            title: "Categories",
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
                    title: "Deals",
                    href: "/deals",
                },
                {
                    title: "Movies",
                    href: "/movies",
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
