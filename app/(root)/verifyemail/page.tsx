'use client'

import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [verified, setVerified] = useState<any>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter()

  useEffect(() => {
    async function isVerified(token: string) {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/verifyemail`, { token, emailType: "Verify" });

        if (res.data.success) {
          setVerified(true);
          router.push("/auth/login")
        } else {
          setVerified(false);
        }
      } catch (err) {
        setVerified(false);
        console.log(err);
      }
    }
    if (token) {
      isVerified(token);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {verified ? (
        <h1 className="text-4xl m-auto text-green-600">Email Verified</h1>
      ) : (
        <h1 className="text-4xl m-auto text-red-500">Failed to verify the Email</h1>
      )}
    </div>
  );
}
