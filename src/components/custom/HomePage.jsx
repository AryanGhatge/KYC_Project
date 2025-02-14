import Image from "next/image";
import React from "react";
import eKYCImage from "@/../public/Online_test.png";
import { Button, useComputedColorScheme } from "@mantine/core";
import Link from "next/link";
import Navbar from "./Navbar";

const HomePage = () => {
  const computedColorScheme = useComputedColorScheme("light");
  const isDark = computedColorScheme === "dark";

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-white"
      } transition-colors duration-300`}
    >
      <Navbar />

      <main className="pt-16 sm:pt-20 h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-8 sm:py-16 h-full">
            {/* Content Section */}
            <div className="flex-1 text-center lg:text-left">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2
                    className={`text-xl sm:text-2xl ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    } dark:text-gray-400 font-light transition-colors duration-300`}
                  >
                    Welcome
                  </h2>
                  <h1
                    className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    } dark:text-white transition-colors duration-300`}
                  >
                    Ayush!!!
                  </h1>
                </div>

                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } dark:text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 transition-colors duration-300`}
                >
                  We're excited to have you here. To get started, let's complete
                  your KYC (Know Your Customer) process. It's quick and easy,
                  and it ensures your account stays secure.
                </p>

                <div className="pt-4">
                  <Link href="/e-kyc">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Get Started →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex-1 relative w-full">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <Image
                  src={eKYCImage}
                  alt="KYC Illustration"
                  layout="fill"
                  priority
                  className="object-contain drop-shadow-xl animate-float dark:brightness-90 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};  

export default HomePage;
