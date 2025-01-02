'use client'

import axios from "axios";
import { useState } from "react";



export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [log, setLog] = useState(false);

  async function handleOnSubmit(e: React.MouseEvent<SVGSVGElement, MouseEvent>, email: string) {
    e.preventDefault()
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgotPassword`, { email })
      setLog(true)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form className="my-2 flex flex-col items-center justify-center h-screen gap-3">
      <h1 className="font-extrabold text-3xl my-3">Give us your Email</h1>
      {log && <div className="font-bold text-green-600 my-3">Verification Mail Sent . Check Your Inbox</div>}
      <div className="flex gap-3 border p-3 rounded">
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="shadow bg-slate-500 text-white font-bold rounded outline-none px-4 py-2" required />
        <svg onClick={(e) => handleOnSubmit(e, email)} className="h-9 cursor-pointer active:scale-95" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#1c71d8" d="M352 224l-46.5 0c-45 0-81.5 36.5-81.5 81.5c0 22.3 10.3 34.3 19.2 40.5c6.8 4.7 12.8 12 12.8 20.3c0 9.8-8 17.8-17.8 17.8l-2.5 0c-2.4 0-4.8-.4-7.1-1.4C210.8 374.8 128 333.4 128 240c0-79.5 64.5-144 144-144l80 0 0-61.3C352 15.5 367.5 0 386.7 0c8.6 0 16.8 3.2 23.2 8.9L548.1 133.3c7.6 6.8 11.9 16.5 11.9 26.7s-4.3 19.9-11.9 26.7l-139 125.1c-5.9 5.3-13.5 8.2-21.4 8.2l-3.7 0c-17.7 0-32-14.3-32-32l0-64zM80 96c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-48c0-17.7 14.3-32 32-32s32 14.3 32 32l0 48c0 44.2-35.8 80-80 80L80 512c-44.2 0-80-35.8-80-80L0 112C0 67.8 35.8 32 80 32l48 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 96z" /></svg>

      </div>
    </form>
  )
}