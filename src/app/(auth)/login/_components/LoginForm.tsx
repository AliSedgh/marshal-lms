"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GitBranchIcon, Loader, MailIcon } from "lucide-react";
import React, { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
const LoginForm = () => {
  const [githubLoading, githubTransition] = useTransition();
  const [emailLoading, emailTransition] = useTransition();
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function signInWithGithub() {
    githubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected...");
          },
          onError: (error) => {
            toast.error("internal server error");
          },
        },
      });
    });
  }
  async function sendEmailOTP() {
    emailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess() {
            toast.success("Email OTP sent, please check your email");
            router.push(`/verify-request?email=${email}`);
          },
          onError(error) {
            toast.error("Failed to send email OTP");
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>Login with your Github Email Account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={signInWithGithub}
          disabled={githubLoading}
          className="w-full"
          variant={"outline"}
        >
          {githubLoading ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GitBranchIcon className="size-4" />
              Sign in with Github
            </>
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute mt-2 after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="m@example.com"
              type="email"
              required
            />
          </div>
          <Button disabled={emailLoading || !email} onClick={sendEmailOTP}>
            {emailLoading ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <MailIcon className="size-4" />
                Continue with Email
              </>
            )}{" "}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
