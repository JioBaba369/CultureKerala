
"use client";

import Link from "next/link";
import {
  Bookmark,
  UserCircle,
  Menu,
  LogOut,
  Settings,
  HelpCircle,
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationConfig } from "@/config/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { siteConfig } from "@/config/site";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { KeralaIcon } from "../ui/kerala-icon";
import { GlobalSearch } from "../ui/global-search";

export function Header() {
  const pathname = usePathname();
  const navLinks = navigationConfig?.mainNav ?? [];
  const { user, appUser, logout } = useAuth();

  const normalize = (p: string) => (p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);

  const isActive = (href: string) => {
    const path = normalize(pathname);
    const target = normalize(href);
    if (target === "/") return path === "/";
    return path === target || path.startsWith(`${target}/`);
  };

  const displayName = appUser?.displayName || user?.displayName || "Guest";
  const username = appUser?.username || user?.email?.split("@")?.[0] || "user";
  const avatarInitial = displayName?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader className="p-4 flex flex-row items-center justify-between">
                 <SheetClose asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <KeralaIcon className="h-6 w-6 text-primary" />
                      <span className="font-bold font-headline">{siteConfig.name}</span>
                    </Link>
                  </SheetClose>
              </SheetHeader>
              <nav className="grid items-start gap-1 p-4 text-lg" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "transition-colors rounded-md py-2 px-3",
                          active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {link.title}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <Link href="/" className="mr-6 hidden md:flex items-center gap-2" aria-label={siteConfig.name}>
          <KeralaIcon className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">
            {siteConfig.name}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium" aria-label="Main navigation">
          {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                          "transition-colors",
                          active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-current={active ? "page" : undefined}
                  >
                      {link.title}
                  </Link>
              );
          })}
        </nav>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className='w-full max-w-sm lg:max-w-md'>
             <GlobalSearch />
          </div>
          <nav className="flex items-center gap-2" aria-label="User actions">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:inline-flex"
              aria-label="Saved Items"
            >
              <Link href="/saved">
                <Bookmark className="h-5 w-5" />
              </Link>
            </Button>
            {user && appUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    aria-label="Open account menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={appUser.photoURL || undefined} alt={displayName} />
                      <AvatarFallback>{avatarInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${username}`}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/saved"><Bookmark className="mr-2 h-4 w-4" />Saved Items</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                    <Link href="/user/account">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/contact">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                >
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
