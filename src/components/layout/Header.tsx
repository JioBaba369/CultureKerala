
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, Bookmark } from "lucide-react";
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

export function Header() {
  const pathname = usePathname();
  const { user, appUser, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <KeralaIcon className="h-6 w-6" />
            <span className="inline-block font-headline font-bold">{siteConfig.name}</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
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
        
        <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex flex-1 justify-center max-w-md">
                <GlobalSearch />
            </div>
            <nav className="flex items-center space-x-2">
                <Link href="/saved" className="hidden sm:inline-flex">
                    <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5"/>
                        <span className="sr-only">Saved Items</span>
                    </Button>
                </Link>

                {user ? (
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
                ) : (
                    <div className="hidden md:flex gap-2">
                        <Button asChild variant="secondary">
                           <Link href="/auth/login">Login</Link>
                        </Button>
                         <Button asChild>
                           <Link href="/auth/signup">Sign Up</Link>
                        </Button>
                    </div>
                )}


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
                    <SheetContent side="left">
                         <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setIsSheetOpen(false)}>
                            <KeralaIcon className="h-6 w-6 text-primary" />
                            <span className="inline-block font-bold text-foreground">{siteConfig.name}</span>
                        </Link>
                        <nav className="flex flex-col gap-4">
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

                             {user ? (
                                <Link href="/admin" onClick={() => setIsSheetOpen(false)} className="text-muted-foreground hover:text-foreground">Dashboard</Link>
                             ) : (
                                <>
                                 <Link href="/auth/login" onClick={() => setIsSheetOpen(false)} className="text-muted-foreground hover:text-foreground">Login</Link>
                                 <Link href="/auth/signup" onClick={() => setIsSheetOpen(false)} className="text-muted-foreground hover:text-foreground">Sign Up</Link>
                                </>
                             )}
                        </nav>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
      </div>
    </header>
  );
}

