
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, Bookmark, ChevronDown } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlobalSearch } from "../ui/global-search";
import { siteConfig } from "@/config/site";
import { KeralaIcon } from "../ui/kerala-icon";
import { useState } from "react";
import { Separator } from "../ui/separator";

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
            <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
                <KeralaIcon className="h-6 w-6 text-primary" />
                <span className="inline-block font-headline font-bold text-primary">{siteConfig.name}</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
                {navigationConfig.mainNav.map((item) => (
                    item.items ? (
                        <DropdownMenu key={item.title}>
                            <DropdownMenuTrigger asChild>
                                <button className={cn(
                                    "flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                                    pathname.startsWith(item.href) && "text-foreground"
                                    )}>
                                    {item.title}
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href={item.href}>All Classifieds</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {item.items.map(subItem => (
                                    <DropdownMenuItem key={subItem.href} asChild>
                                        <Link href={subItem.href}>{subItem.title}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                            "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                            pathname === item.href && "text-foreground"
                            )}
                        >
                            {item.title}
                        </Link>
                    )
                ))}
            </nav>
            </div>
            
            <div className="flex flex-1 items-center justify-end space-x-2">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                    <GlobalSearch />
                </div>
                <div className="hidden md:block">
                    <UserMenu />
                </div>

                {/* Mobile Menu */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="md:hidden"
                            size="icon"
                            >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <SheetHeader>
                            <SheetTitle className="sr-only">Main Menu</SheetTitle>
                        </SheetHeader>
                        <Link href="/" className="flex items-center space-x-2 mb-4 pl-6" onClick={() => setIsSheetOpen(false)}>
                            <KeralaIcon className="h-6 w-6 text-primary" />
                            <span className="inline-block font-bold">{siteConfig.name}</span>
                        </Link>
                        <nav className="flex flex-col gap-4 px-6">
                            {navigationConfig.mainNav.map((item) => (
                                item.items ? (
                                    <div key={item.title}>
                                        <h4 className="font-semibold text-muted-foreground mb-2 mt-2">{item.title}</h4>
                                        <div className="flex flex-col gap-4 pl-4">
                                            <Link href={item.href} onClick={() => setIsSheetOpen(false)} className={cn(
                                "text-muted-foreground hover:text-foreground",
                                pathname === item.href && "text-foreground font-semibold"
                                )}>All Classifieds</Link>
                                            {item.items.map(subItem => (
                                                <Link key={subItem.href} href={subItem.href} onClick={() => setIsSheetOpen(false)} className={cn(
                                                    "text-muted-foreground hover:text-foreground",
                                                    pathname === subItem.href && "text-foreground font-semibold"
                                                    )}>
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsSheetOpen(false)}
                                        className={cn(
                                        "text-muted-foreground hover:text-foreground",
                                        pathname === item.href && "text-foreground font-semibold"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                )
                            ))}

                            <Separator />

                            <Link href="/saved" onClick={() => setIsSheetOpen(false)} className="flex items-center text-muted-foreground hover:text-foreground">
                                <Bookmark className="mr-2 h-4 w-4" />Saved Items
                            </Link>

                            <Separator />

                            <UserMenu isMobile={true} onLinkClick={() => setIsSheetOpen(false)} />
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>
  );
}


function UserMenu({ isMobile, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) {
    const { user, appUser, logout } = useAuth();
    
    if(!user) {
        if (isMobile) {
            return (
                <div className="flex flex-col gap-4">
                    <Link href="/auth/login" onClick={onLinkClick} className="text-muted-foreground hover:text-foreground">Login</Link>
                    <Link href="/auth/signup" onClick={onLinkClick} className="text-muted-foreground hover:text-foreground">Sign Up</Link>
                </div>
            )
        }
        return (
            <div className="flex gap-2">
                <Button asChild variant="ghost">
                   <Link href="/auth/login">Login</Link>
                </Button>
                 <Button asChild>
                   <Link href="/auth/signup">Sign Up</Link>
                </Button>
            </div>
        )
    }

    if (isMobile) {
        return (
             <div className="flex flex-col gap-4">
                <Link href="/admin" onClick={onLinkClick} className="text-muted-foreground hover:text-foreground">Dashboard</Link>
                <Link href="#" onClick={() => { logout(); onLinkClick?.(); }} className="text-muted-foreground hover:text-foreground">Logout</Link>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={appUser?.photoURL || undefined} alt={appUser?.displayName || 'User'} />
                        <AvatarFallback>{appUser?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{appUser?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                    </p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin"><UserCircle className="mr-2 h-4 w-4" />Dashboard</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/saved"><Bookmark className="mr-2 h-4 w-4" />Saved Items</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}