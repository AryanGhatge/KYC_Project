import React from "react";
import Logo from "@/../public/logo-inr.svg.png";
import Logo2 from "@/../public/logo-inr2.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoPerson } from "react-icons/io5";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IoMoon, IoSunny } from "react-icons/io5";

const Navbar = () => {
  const router = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const isDark = computedColorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 lg:top-2 w-full backdrop-blur-md z-50">
      <div
        className={`
        px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto 
        ${
          isDark
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/50 border-gray-200"
        }
        border lg:rounded-full 
        shadow-lg backdrop-blur-lg
        transition-all duration-300 ease-in-out
      `}
      >
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section */}
          <div className="w-20 md:w-28 relative">
            <Image
              src={isDark ? Logo2 :Logo}
              alt="logo"
              className={`
                cursor-pointer transform hover:scale-105
                ${isDark ? "brightness-100 contrast-100" : "brightness-90"}
                transition-all duration-300
              `}
            />
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ActionIcon
              variant="subtle"
              onClick={toggleTheme}
              size="lg"
              className={`
                rounded-full p-2
                ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }
                transition-all duration-300 ease-in-out
              `}
              aria-label="Toggle color scheme"
            >
              {isDark ? (
                <IoSunny className="text-xl animate-spin-slow" />
              ) : (
                <IoMoon className="text-xl" />
              )}
            </ActionIcon>

            {/* Sign In Button */}
            <Button
              variant="outline"
              onClick={() => router.push("/signin")}
              className={`
                flex items-center gap-2 px-4 py-2
                rounded-full transform hover:scale-105
                ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white border-gray-700"
                    : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                }
                shadow-sm hover:shadow-md
                transition-all duration-300 ease-in-out
              `}
            >
              <IoPerson
                className={`text-lg ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span className={`font-medium`}>Sign in</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
