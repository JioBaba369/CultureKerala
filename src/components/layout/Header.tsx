
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, Bookmark, ChevronDown, LogOut } from "lucide-react";
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
import { ThemeToggle } from "../ui/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
             <KeralaIcon className="h-6 w-6" />
             <span className="hidden font-bold sm:inline-block font-headline">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
             {navigationConfig.mainNav.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                    "flex items-center text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground",
                    pathname === item.href && "text-primary-foreground"
                    )}
                >
                    {item.title}
                </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
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
                ))}

                <Separator />

                 <div className="flex flex-col gap-4">
                    <UserMenu isMobile={true} onLinkClick={() => setIsSheetOpen(false)} />
                </div>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <GlobalSearch />
          </div>
           <nav className="hidden md:flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </nav>
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
                <div className="flex flex-col gap-4 pt-4">
                    <Button asChild variant="outline" onClick={onLinkClick}><Link href="/auth/login">Login</Link></Button>
                    <Button asChild onClick={onLinkClick}><Link href="/auth/signup">Sign Up</Link></Button>
                </div>
            )
        }
        return (
            <div className="flex gap-2">
                <Button asChild variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
                   <Link href="/auth/login">Login</Link>
                </Button>
                 <Button asChild variant="secondary">
                   <Link href="/auth/signup">Sign Up</Link>
                </Button>
            </div>
        )
    }

    if (isMobile) {
        return (
             <div className="flex flex-col gap-4">
                <h4 className="font-semibold text-muted-foreground">My Account</h4>
                <Link href="/saved" onClick={onLinkClick} className="flex items-center text-muted-foreground hover:text-foreground">
                    <Bookmark className="mr-2 h-4 w-4" />Saved Items
                </Link>
                 <Link href="/admin" onClick={onLinkClick} className="flex items-center text-muted-foreground hover:text-foreground">
                    <UserCircle className="mr-2 h-4 w-4" />My Dashboard
                </Link>
                <Button variant="outline" onClick={() => { logout(); onLinkClick?.(); }} className="w-full justify-start mt-2">
                    <LogOut className="mr-2 h-4 w-4" />Logout
                </Button>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary/80">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={appUser?.photoURL || undefined} alt={appUser?.displayName || 'User'} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">{appUser?.displayName?.charAt(0) || 'U'}</AvatarFallback>
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
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
