"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import React, { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const VerifyRequest = () => {
  const [otp, setOtp] = useState("");
  const [emailPending, emailTransition] = useTransition();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };
  const handleVerifyRequest = () => {
    emailTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email || "",
        otp,
        fetchOptions: {
          onSuccess() {
            toast.success("Email verified");
            router.push("/");
          },
          onError() {
            toast.error("Failed to verify email");
          },
        },
      });
    });
  };
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">please check Your Email</CardTitle>
        <CardDescription>
          We have sent you an email to verify your email address. Please check
          your email and click the link to verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={handleOtpChange}
          >
            <InputOTPGroup>
              <InputOTPSlot className="w-10 h-10" index={0} />
              <InputOTPSlot className="w-10 h-10" index={1} />
              <InputOTPSlot className="w-10 h-10" index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot className="w-10 h-10" index={3} />
              <InputOTPSlot className="w-10 h-10" index={4} />
              <InputOTPSlot className="w-10 h-10" index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p>Enter the 6-digit code sent to your email</p>
        </div>
        <Button
          className="w-full"
          disabled={otp.length !== 6 || emailPending}
          onClick={handleVerifyRequest}
        >
          {emailPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            "Verify Request"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const VerifyRequestPage = () => {
  return (
    <Suspense>
      <VerifyRequest />
    </Suspense>
  );
};

export default VerifyRequestPage;
