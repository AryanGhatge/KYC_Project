import React from "react";
import Logo from "@/../public/logo-inr.svg.png";
import Logo2 from "@/../public/logo-inr2.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoPerson } from "react-icons/io5";
import {
  ActionIcon,
} from "@mantine/core";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { logout } from "@/slices/authSlice";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Navbar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogOut = async() => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/logout`);
      dispatch(logout());
      router.push("/signin");
    } catch (error) {
      console.log(error);
    }

  }

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
              onClick={isAuthenticated ? handleLogOut : () => router.push("/signin")}
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
              {
                isAuthenticated ? (<FiLogOut
                className={`text-lg ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />) : (<IoPerson
                className={`text-lg ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />)
              }
              <span className={`font-medium`}>{isAuthenticated ? "Log out" : "Sign In"}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
