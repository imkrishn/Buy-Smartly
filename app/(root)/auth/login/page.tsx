'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ForgotPassword from '@/components/ForgotPassword';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import axios from 'axios';

interface USER {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<USER>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLogging, setIsLogging] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLogging(true)
    try {
      const { data }: { data: ApiResponse } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, formData);
      setFormData({ email: '', password: '' });

      if (!data.success) {
        setError(data.message || 'Invalid username or password');
        return;
      }

      router.push('/');
      window.location.reload()
    } catch (err) {
      console.error(err);
      setError('Check Your Credentials.');
    } finally {
      setIsLogging(false)
    }
  };

  return (
    <div className="login w-screen h-screen relative  border-none ">
      <Image
        src="/auth-bg.jpg"
        alt="Background Image"
        fill
        quality={100}
        className="absolute inset-0 h-full w-full object-cover"
        priority
      />
      <form onSubmit={onSubmit} className="absolute inset-0 flex justify-center items-center z-10 p-7">
        <div className="bg-black bg-opacity-55 p-6 rounded-md shadow-lg w-full max-w-md px-7 flex flex-col items-center">
          <h1 className="text-xl mb-4 text-center text-white">Login</h1>
          {error && <span className="text-red-500 text-sm my-2">{error}</span>}
          <div className="flex items-center bg-white border border-gray-300 rounded w-full mb-4 gap-3">
            <svg className='h-7 pl-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" /></svg>
            <input
              onChange={handleChange}
              type="email"
              placeholder="Your Email"
              className="p-2 rounded-md w-full outline-none"
              name="email"
              value={formData.email}
              required
            />
          </div>
          <div className="flex items-center bg-white border border-gray-300 rounded w-full mb-4 gap-3">
            <svg className='h-7 pl-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" /></svg>
            <input
              onChange={handleChange}
              type="password"
              placeholder="Your Password"
              className="p-2 rounded-md w-full outline-none"
              name="password"
              value={formData.password}
              required
            />
          </div>
          <Button type="submit" size="icon" className="w-full">
            {isLogging ? "Logging in" : "Login"}
          </Button>
          <ForgotPassword />
          <div className="flex gap-7 mt-7">
            <Image
              src="/github-logo.png"
              alt="GitHub"
              height={35}
              width={35}
              className="rounded-full cursor-pointer active:scale-95 bg-cover"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            />
          </div>
          <h3 className="text-white mt-3"> New Here</h3>
          <Link href="/auth/signup" passHref>
            <Button variant="secondary" className="w-full">
              Register
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
