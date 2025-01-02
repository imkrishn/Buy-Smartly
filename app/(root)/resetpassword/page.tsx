'use client'

import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ResetPassword() {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [isVerified, setIsVerified] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams();
  const token: any = searchParams.get("token");



  async function resetPassword(
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    e.preventDefault();

    // Validate inputs
    if (password.trim() !== confirmPassword.trim()) {
      return alert("Password and confirm password must be the same.");
    }

    if (password.trim() === "" || confirmPassword.trim() === "") {
      return alert("Password and confirm password cannot be empty.");
    }

    try {
      // Send reset password request to the API
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resetPassword`,
        { email, password, confirmPassword }
      );

      if (res.data.success) {
        alert("Password reset successfully. Redirecting to login...");
        router.push("/auth/login");
      } else {
        setError(res.data.message)
        alert(res.data.message || "An error occurred while resetting the password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password. Please try again later.");
    }
  }

  useEffect(() => {
    async function verifyUser(token: string) {
      try {
        setLoading(true)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/verifyemail`, { token, emailType: "Reset" })
        console.log(res);

        if (res.data.success) {
          setIsVerified(true)
        }
      } catch (err) {
        console.log(err);
        setIsVerified(false)
      } finally {
        setLoading(false)
      }
    }
    verifyUser(token)
  }, [])

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {loading && <div className="spinner m-auto"></div>}
      {(!loading && !isVerified) && <div className="text-4xl text-red-500">Failed To Verify You</div>}
      {(!loading && isVerified) &&
        <form onSubmit={(e) => resetPassword(e, email, password, confirmPassword)} className="border shadow-lg rounded p-7 flex flex-col items-center justify-center  gap-3 ">
          {error && <div className="text-red-500 font-bold my-3">{error || "Check the credentails"}</div>}
          <h1 className="font-extrabold text-3xl my-3">Reset the Password</h1>
          <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="shadow bg-slate-500 text-white font-bold rounded outline-none px-4 py-2" required />
          <input onChange={(e) => setPassword(e.target.value)} minLength={8} type="password" placeholder="New Password" className="shadow bg-slate-500 text-white font-bold rounded outline-none px-4 py-2" required />
          <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" className="shadow bg-slate-500 text-white font-bold rounded outline-none px-4 py-2" required />

          <div className="flex gap-7">
            <Button variant={'destructive'} type="reset">Reset</Button>
            <Button variant={'checkout'} type="submit">Proceed</Button>
          </div>
        </form>
      }

    </div>
  )
}