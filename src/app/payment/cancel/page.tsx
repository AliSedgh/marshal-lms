import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const PaymentCancelPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Card className="w-[365px]">
        <CardContent>
          <div className="w-full flex items-center justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold ">Payment Cancelled</h2>
            <p className="text-sm mt-2 text-muted-foreground text-balance tracking-tight">
              Now worries,you wont be charged.please try again
            </p>
            <Button className="w-full mt-5" asChild>
              <Link href={"/"}>
                <ArrowLeft className="size-4 mr-2" />
                Go to Home page
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
