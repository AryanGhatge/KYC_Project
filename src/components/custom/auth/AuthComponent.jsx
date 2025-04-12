"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/slices/authSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthComponent = ({ isLogin = true }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useDispatch(); 

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      // Mobile number validation (Indian format: +91 followed by 10 digits)
      const mobileRegex = /^91[6-9]\d{9}$/;
      if (!mobileRegex.test(mobileNo)) {
        newErrors.mobileNo =
          "Please enter valid Indian mobile number (91XXXXXXXXXX)";
      }

      // Password confirmation
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) return;
  
      const payload = isLogin
        ? { email, password }
        : {
            email,
            password,
            confirmedPassword: confirmPassword,
            name: fullName,
            mobileNo: mobileNo,
          };
  
      const response = await axios.post(
        isLogin ? `${BASE_URL}/auth/login` : `${BASE_URL}/auth/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
  
      if (response.data.success === true) {
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          id: response.data.user._id,
        };
        
        // Dispatch user data to Redux
        // console.log('Dispatching user data:', userData);
        await dispatch(setUser(userData));
        
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          router.push("/");
        }, 100);
      } else {
        setErrors({ submit: response.data.message || "Authentication failed" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        submit: error.response?.data?.message || "An error occurred. Please try again."
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      className={`flex min-h-screen ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <motion.div
        className={`flex flex-col md:flex-row m-auto ${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl overflow-hidden max-w-4xl transition-colors duration-300`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col md:justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">KYC-Secure</h2>
            <h3 className="text-2xl font-semibold mb-4">
              Welcome to the Future of KYC
            </h3>
            <p className="mb-6">
              Join thousands leveraging AI for secure, efficient KYC processes.
              Experience faster verifications and enhanced data protection.
            </p>
          </div>
          <div>
            <p className="text-sm">© 2024 KYC-Secure. All rights reserved.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`w-full md:w-1/2 p-12 ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">
            {isLogin ? "Log in to your account" : "Create your account"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
              <div className="mb-4">
                <label
                  className={`block ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } text-sm font-bold mb-2`}
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User
                      className={`h-5 w-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </span>
                  <input
                    className={`appearance-none border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                    } rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
              <label
                className={`block ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } text-sm font-bold mb-2`}
              >
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone
                    className={`h-5 w-5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </span>
                <input
                  className={`appearance-none border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  } rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  type="tel"
                  placeholder="91XXXXXXXXXX"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  required
                />
              </div>
              {errors.mobileNo && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.mobileNo}
                </p>
              )}
            </div>
            
              </div>
            )}

            

            {/* Email Input */}
            <div className="mb-4">
              <label
                className={`block ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } text-sm font-bold mb-2`}
              >
                Email address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail
                    className={`h-5 w-5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </span>
                <input
                  className={`appearance-none border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  } rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="mb-2">
              <label
                className={`block text-sm font-bold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 bottom-3 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  className={`appearance-none border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  } rounded w-full py-2 px-3 pl-10 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password field (only for signup) */}
            {!isLogin && (
              <div className="mb-6">
                <label
                  className={`block text-sm font-bold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 bottom-3 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    className={`appearance-none border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                    } rounded w-full py-2 px-3 pl-10 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit button and error message */}
            <div className="flex flex-col gap-3">
              {errors.submit && (
                <p className="text-red-500 text-sm text-center">
                  {errors.submit}
                </p>
              )}
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                {isLogin ? "Log in" : "Sign up"}
              </button>
            </div>
          </form>
          
          {/* Social Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${
                    isDark ? "border-gray-600" : "border-gray-300"
                  }`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${
                    isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-500"
                  }`}
                >
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <Button
                  // onClick={() => handleSocialSignIn("google")}
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                  />
                </Button>
              </div>
              <div>
                <Button
                  // onClick={() => handleSocialSignIn("linkedin")}
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/448234/linkedin.svg"
                    alt="LinkedIn logo"
                  />
                </Button>
              </div>
              <div>
                <button
                  // onClick={() => handleSocialSignIn("github")}
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                    alt="GitHub logo"
                  />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center mt-8">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                isLogin ? router.push("/signup") : router.push("/signin");
              }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthComponent;
