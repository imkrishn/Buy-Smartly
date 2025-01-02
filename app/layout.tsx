
"use client"


import localFont from "next/font/local";
import "./styles/globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { Provider } from "react-redux";
import { store, persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { usePathname } from "next/navigation";

//import "easymde/dist/easymde.min.css";
//import { Toaster } from "@/components/ui/toaster";

const workSans = localFont({
  src: [
    {
      path: "./fonts/WorkSans-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Thin.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-ExtraLight.ttf",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-work-sans",
});



/* interface LayoutProps {
  children: React.ReactNode;

} */

const paths = ["/", "/auth/login", "/auth/signup", "/about",];
const dynamicPaths = ["/category/[slug]", "/products/[id]", "/cart/[id]", "/order/[id]", "/profile/[id]", "/myorders/[id]"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()?.toLowerCase();

  // current path matches any static or dynamic route

  const isDynamicMatch = dynamicPaths.some((route) => {
    const baseRoute = route.replace(/\[.*\]/, "");          // Remove dynamic part
    return path?.startsWith(baseRoute);
  });
  console.log(path);

  const showHeader = paths.includes(path) || isDynamicMatch;


  return (
    <html lang="en">
      <body className={`${workSans.variable} h-full w-full`}>
        <Provider store={store} >
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            {showHeader && <Header />}
            <PageTransition>
              {children}
            </PageTransition>
          </PersistGate>
        </Provider>
        {/*<Toaster />*/}
      </body>
    </html>
  );
}