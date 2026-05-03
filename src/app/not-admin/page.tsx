import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotAdminPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/50 p-4 rounded-full w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Access Restricted
          </CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            You are not authorized to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAdminPage;
