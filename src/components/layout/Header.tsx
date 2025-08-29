
"use client";

import Link from "next/link";
import {
  Bookmark,
  UserCircle,
  PanelLeft,
  LogOut,
  ExternalLink,
  LayoutGrid,
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
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] rounded bg-primary-foreground px-3 py-2 text-primary shadow"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex shrink-0 items-center gap-2" aria-label={siteConfig.name}>
            <KeralaIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-heading hidden md:inline-block text-foreground">
              {siteConfig.name}
            </span>
          </Link>
          
          <div className="flex-1">
             <GlobalSearch className="max-w-xl mx-auto" />
          </div>


          {/* Mobile: menu button */}
          
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="pr-0 bg-background text-foreground">
                <SheetHeader className="p-4 flex flex-row items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <KeralaIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold font-heading">{siteConfig.name}</span>
                  </Link>
                  <div className="sr-only">
                    <SheetTitle>Mobile Menu</SheetTitle>
                    <SheetDescription>Main navigation and search for mobile devices.</SheetDescription>
                  </div>
                </SheetHeader>

                <div className="flex h-full flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <nav className="grid items-start gap-1 p-4 text-lg" aria-label="Mobile navigation">
                      {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                "transition-colors",
                                active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                              )}
                              aria-current={active ? "page" : undefined}
                            >
                              {link.title}
                            </Link>
                          </SheetClose>
                        );
                      })}

                      <SheetClose asChild key="saved-items-mobile">
                        <Link
                          href="/saved"
                          className={cn(
                            "transition-colors",
                            pathname === "/saved" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                          )}
                          aria-current={pathname === "/saved" ? "page" : undefined}
                        >
                          Saved Items
                        </Link>
                      </SheetClose>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          


          <div className="ml-4 flex flex-shrink-0 items-center justify-end gap-2">
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
                  <span className="sr-only">Saved Items</span>
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
                      <Link href="/admin/account">
                        <UserCircle className="mr-2 h-4 w-4" />
                        My Account
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/saved">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Saved Items
                      </Link>
                    </DropdownMenuItem>

                    {appUser?.username && (
                        <DropdownMenuItem asChild>
                            <Link href={`/profile/${appUser.username}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Public Profile
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Admin Dashboard
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
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="default"
                  >
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <nav className="hidden md:flex h-12 items-center justify-center border-b bg-background" aria-label="Main navigation">
        <div className="container flex items-center justify-center gap-6 text-sm font-medium">
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
        </div>
      </nav>
    </>
  );
}
