
"use client";

import Link from "next/link";
import {
  Flame,
  Bookmark,
  CircleUser,
  PanelLeft,
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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationConfig } from "@/config/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const navLinks = navigationConfig.mainNav;
  const { user, logout } = useAuth();
  const [config] = useSiteConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

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
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              {mounted ? config.name : null}
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
              <Flame className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">{mounted ? config.name : null}</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
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
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             <nav className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
                   <Link href="/saved">
                      <Bookmark className="h-5 w-5" />
                      <span className="sr-only">Saved Items</span>
                  </Link>
                </Button>
              </nav>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="relative h-8 w-8 rounded-full">
                  <CircleUser className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </nav>
          )}

        </div>
      </div>
    </header>
  );
}
