"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserMenu } from "./user-menu";
import { useAuthStore } from "~/store";
import { ROUTES } from "~/constants";
import { ThemeToggle } from "./ui/theme-toggle";

export const Header = () => {
  // state to track if the header is scrolled
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  const { user } = useAuthStore((state) => state);

  // effect to add scroll event listener
  // and update the isScrolled state based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 animate-fade-in">
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              tunnel
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/contact">Contact</Link>
            </Button>
            <ThemeToggle />
            {!user ? (
              <>
                <Button asChild variant="outline">
                  <Link href={ROUTES.AUTH["SIGN-IN"]}>Login</Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.AUTH["SIGN-UP"]}>Sign Up</Link>
                </Button>
              </>
            ) : (
              <UserMenu user={user} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
