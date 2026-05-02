"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useSignout = () => {
  const router = useRouter();
  return async () => {
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
};

export default useSignout;
