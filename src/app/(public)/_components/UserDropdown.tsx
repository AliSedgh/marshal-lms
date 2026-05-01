"use client";

import {
  BookOpen,
  ChevronDown,
  Home,
  LayoutDashboardIcon,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const title = "Profile with Preferences";

interface IProps {
  name: string;
  email: string;
  image: string;
}

const UserDropdown = ({ name, email, image }: IProps) => {
  const router = useRouter();
  const signOutHandler = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess() {
          toast.success("Signed out successfully");
          router.push("/");
        },
        onError(error) {
          toast.error("Failed to sign out");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-10 w-10 rounded-full" variant="ghost">
          <Avatar>
            <AvatarImage alt={name} src={image} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDown size={16} className="opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="" href={"/"}>
            <Home size={16} className="opacity-60" aria-hidden />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/courses"}>
            <BookOpen size={16} className="opacity-60" aria-hidden />
            Courses
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/dashboard"}>
            <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={signOutHandler}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
