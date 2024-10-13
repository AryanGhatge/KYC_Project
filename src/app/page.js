"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HomePage from "@/components/custom/HomePage";
import Navbar from "@/components/custom/Navbar";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen">
      <div className="absolute inset-0 bg-gradient opacity-40 pointer-events-none z-0"></div>
      <Navbar />
      <main className="h-[80%] relative flex items-center justify-center flex-col ">
        <HomePage />
      </main>
    </div>
  );
}
