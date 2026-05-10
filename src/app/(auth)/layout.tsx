import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-svh">
      <Button variant="outline" asChild className="absolute top-4 left-4">
        <Link href="/">
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>
      </Button>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href="/"
        >
          <Image src="/logo.jpg" alt="Logo" width={32} height={22} />
          MarshalLMS
        </Link>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
      <div className="text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <span className="hover:text-primary hover:underline cursor-pointer">
          Terms of service
        </span>{" "}
        and{" "}
        <span className="hover:text-primary hover:underline cursor-pointer">
          Privacy policy
        </span>
      </div>
    </div>
  );
};

export default layout;
