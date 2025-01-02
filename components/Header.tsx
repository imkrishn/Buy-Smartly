"use client"

import Auth from "./Auth";
import Navbar from "./Navbar";
import axios from "axios";
import { useState, useEffect } from "react";

// Function to fetch authorization data
async function isAuthorized() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/isAuthorized`, {
      withCredentials: true,

    });

    return response.data;
  } catch (err) {
    console.error("Error during authorization:", err);
    return null;
  }
}

export default function Header() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await isAuthorized(); // Fetch the session data
      setSession(sessionData);
      setIsLoading(false);
    };

    fetchSession();
  }, []);

  if (isLoading) {
    return <div className="m-auto">Loading...</div>;
  }

  return (
    <header className="w-full flex items-center justify-center lg:gap-5 gap-3 lg:px-60 py-3 shadow-lg">
      <Navbar />
      <Auth session={session} />
    </header>
  );
}
