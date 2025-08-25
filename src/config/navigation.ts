
export type NavItem = {
    title: string;
    href: string;
    disabled?: boolean;
};

export type MainNavItem = NavItem;

export type NavigationConfig = {
    mainNav: MainNavItem[];
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
    ],
};
