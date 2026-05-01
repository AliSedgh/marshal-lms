"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/them-toggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserDropdown from "./UserDropdown";

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 min-h-16 flex items-center">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="size-9 rounded-lg"
          />
          <span className="text-2xl font-bold">MarshallLMS.</span>
        </Link>
        <nav className="hidden md:flex items-center md:flex-1 md:items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium  transition-colors hover:bg-muted rounded-md hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isPending ? null : session ? (
              <UserDropdown
                name={session?.user?.name}
                email={session?.user?.email}
                image={session?.user?.image || ""}
              />
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
