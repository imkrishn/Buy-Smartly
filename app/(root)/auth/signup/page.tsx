'use client';

import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface USER {
  fullName: string;
  mobileNumber: string;
  email: string;
  dob: string;
  password: string;
}

export default function SignUp() {
  const [err, setError] = useState<string>("");
  const router = useRouter()

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<USER>();

  const onSubmit: SubmitHandler<USER> = async (data) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, data);
      if (response.status === 200) {
        console.log("Signup Successful:");
        reset();
        router.push("/auth/login");
      }

    } catch (error: any) {
      console.log(error);

      const errorMessage = "Error during signup : User/MobileNumber exists";
      setError(errorMessage);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative">
      <Image
        src="/auth-bg.jpg"
        alt="Background Image"
        fill
        quality={100}
        className="absolute inset-0 h-full w-full object-cover"
        priority
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-black bg-opacity-60 p-7 rounded-lg flex flex-col justify-center items-center z-10 m-7 w-full max-w-md"
      >
        <h2 className="text-white text-2xl font-extrabold select-none mb-6">
          Registration
        </h2>
        {err && <span className="text-red-500 text-sm">{err}</span>}
        <div className="w-full mb-4 flex flex-col">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full outline-none px-4 py-2 rounded text-black"
            {...register("fullName", {
              required: "Full Name is required",
              maxLength: {
                value: 30,
                message: "Full name not more than 30 characters",
              },
            })}
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm">{errors.fullName.message}</span>
          )}
        </div>
        <div className="w-full mb-4 flex flex-col">
          <input
            type="number"
            placeholder="Mobile Number"
            className="w-full outline-none px-4 py-2 rounded text-black"
            {...register("mobileNumber", {
              required: "Mobile Number is required",
              maxLength: {
                value: 10,
                message: "Mobile Number not more than 10 characters",
              },
              minLength: {
                value: 10,
                message: "Mobile Number not less than 10 characters",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Mobile Number should only contain digits",
              },
            })}
          />
          {errors.mobileNumber && (
            <span className="text-red-500 text-sm">{errors.mobileNumber.message}</span>
          )}
        </div>
        <div className="w-full mb-4 flex flex-col">

          <input
            type="email"
            placeholder="E-Mail"
            className="w-full outline-none px-4 py-2 rounded text-black"
            {...register("email", {
              required: "Email is required",
              maxLength: {
                value: 30,
                message: "Email not more than 30 characters",
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="w-full mb-4 flex flex-col">
          <input
            type="date"
            className="w-full outline-none px-4 py-2 rounded text-black"
            {...register("dob", {
              required: "Date of Birth is required",
            })}
          />
          {errors.dob && (
            <span className="text-red-500 text-sm">{errors.dob.message}</span>
          )}
        </div>
        <div className="w-full mb-6 flex flex-col">
          <input
            type="password"
            placeholder="Password"
            className="w-full outline-none px-4 py-2 rounded text-black"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password should be a minimum of 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password must contain at least one letter and one number",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between w-full gap-4">
          <Button variant="destructive" type="reset" className="w-1/2">
            Reset
          </Button>
          <Button
            disabled={isSubmitting}
            variant="default"
            type="submit"
            className="w-1/2 active:bg-blue-900"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
}
