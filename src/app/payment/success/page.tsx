"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const PaymentSuccessPage = () => {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Card className="w-[365px]">
        <CardContent>
          <div className="w-full flex items-center justify-center">
            <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Success</h2>
            <p className="text-sm mt-2 text-muted-foreground text-balance tracking-tight">
              Congrats your payment was successful.you can now start learning
            </p>
            <Button className="w-full mt-5" asChild>
              <Link href={"/dashboard"}>
                <ArrowLeft className="size-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
