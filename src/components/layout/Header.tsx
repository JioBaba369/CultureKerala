
"use client";

import Link from "next/link";
import {
  Heart,
  Bookmark,
  UserCircle,
  PanelLeft,
  UserCog,
  LogOut,
  ExternalLink,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationConfig } from "@/config/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { siteConfig } from "@/config/site";
import { GlobalSearch } from "../ui/global-search";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export function Header() {
  const pathname = usePathname();
  const navLinks = navigationConfig.mainNav;
  const { user, appUser, logout } = useAuth();
  const router = useRouter();
  
  const isActive = (href: string) => {
    // Exact match for the homepage
    if (href === "/") {
      return pathname === "/";
    }
    // For other links, check if the pathname starts with the href.
    return pathname.startsWith(href);
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              href="/"
              className="flex items-center space-x-2 px-4"
            >
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">{siteConfig.name}</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="px-4 mb-4">
                    <GlobalSearch />
                </div>
              <div className="flex flex-col space-y-3 px-4">
                 {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "transition-colors hover:text-foreground",
                        isActive(link.href)
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      {link.title}
                    </Link>
                  ))}
                   <Link
                      href={'/saved'}
                      className={cn(
                        "transition-colors hover:text-foreground",
                        pathname === '/saved'
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      Saved Items
                    </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             <div className="hidden md:block">
                <GlobalSearch />
              </div>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
                <Link href="/saved">
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Saved Items</span>
                </Link>
            </Button>
            {user && appUser ? (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={appUser.photoURL || undefined} alt={appUser.displayName} />
                            <AvatarFallback>{appUser.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{appUser.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          @{appUser.username}
                        </p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                        <Link href="/admin/account"><UserCircle className="mr-2 h-4 w-4" />My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/saved"><Bookmark className="mr-2 h-4 w-4" />Saved Items</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/profile/${appUser?.username}`} target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> View Public Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/admin"><LayoutGrid className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout().then(() => router.push('/'))}><LogOut className="mr-2 h-4 w-4"/>Log out</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                    <Link href="/auth/signup">Sign Up</Link>
                </Button>
                </>
            )}
           </nav>
        </div>
      </div>
    </header>
  );
}
