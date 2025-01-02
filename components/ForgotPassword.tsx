'use client'

import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <div className='relative w-full'>
      <Link href="/auth/forgotPassword">
        <div className="absolute right-1 text-blue-600 cursor-pointer hover:text-blue-700 ">Forgot Password?</div>
      </Link>
    </div>
  );
}
