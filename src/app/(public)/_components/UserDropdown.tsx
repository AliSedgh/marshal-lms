"use client";

import {
  BookOpen,
  ChevronDown,
  Home,
  LayoutDashboardIcon,
  Loader2,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import useSignout from "@/hooks/useSignout";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { changeRole } from "@/actions/changeRole";
import { toast } from "sonner";
import { IconSwitch } from "@tabler/icons-react";

export const title = "Profile with Preferences";

interface IProps {
  name: string;
  email: string;
  image: string;
  role: string;
  onRoleChanged?: () => void | Promise<void>;
}

const UserDropdown = ({ name, email, image, role, onRoleChanged }: IProps) => {
  const signOutHandler = useSignout();
  const [isPending, startTransition] = useTransition();
  const changeRoleHandler = () => {
    startTransition(async () => {
      const result = await tryCatch(changeRole());
      if (result.error) {
        toast.error("unexpected error occurred");
        return;
      }
      if (result.data.status === "success") {
        toast.success(result.data.message);
        await onRoleChanged?.();
      } else {
        toast.error(result.data.message);
      }
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-10 w-10 rounded-full" variant="ghost">
          <Avatar>
            <AvatarImage alt={name} src={image} />
            <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDown size={16} className="opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
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
        {role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href={"/admin"}>
              <LayoutDashboardIcon
                size={16}
                className="opacity-60"
                aria-hidden
              />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={signOutHandler}>
          <LogOut />
          Log out
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-transparent">
          <Button
            onClick={(e) => {
              e.preventDefault();
              changeRoleHandler();
            }}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Switching...
              </>
            ) : (
              <>
                <IconSwitch size={16} className="opacity-60" aria-hidden />
                {role === "admin" ? "Switch to User" : "Switch to Admin"}
              </>
            )}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
