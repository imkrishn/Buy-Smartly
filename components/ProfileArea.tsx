'use client';

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProfileArea({ email }: { email: string }) {
  const router = useRouter();
  const [isLoadingSignOut, setIsLoadingSignOut] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleSignOut = async () => {
    setIsLoadingSignOut(true);
    try {
      await signOut({ redirect: false });
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/signout`);
      router.push("/auth/login");
      window.location.reload()
    } catch (error) {
      toast.error("Failed to sign out.");
      console.error("Sign out error:", error);
    } finally {
      setIsLoadingSignOut(false);
    }
  };

  const handleDeleteAccount = async (email: string) => {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation) {
      setIsLoadingDelete(true);
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/delete`, {
          params: { email },
        });

        if (response.data.status) {
          toast.success("Account deleted successfully!")
          await signOut({ redirect: false });
          router.push("/auth/login");
          window.location.reload()
        } else {
          toast.error("Failed to delete account.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("An error occurred while deleting the account.");
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-evenly">
      <Button
        variant="destructive"
        onClick={() => handleDeleteAccount(email)}
        disabled={isLoadingDelete}
      >
        {isLoadingDelete ? "Deleting..." : "Delete Account"}
      </Button>
      <Button
        variant="checkout"
        onClick={handleSignOut}
        disabled={isLoadingSignOut}
      >
        {isLoadingSignOut ? "Signing Out..." : "SignOut"}
      </Button>
    </div>
  );
}
