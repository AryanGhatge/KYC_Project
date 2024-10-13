"use client";

import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AuthComponent = ({ isLogin = true }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {};

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
    <div className="flex min-h-screen bg-gray-100">
      <motion.div
        className="flex flex-col md:flex-row m-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
        <div className="w-full md:w-1/2 p-12">
          <h2 className="text-2xl font-bold mb-6">
            {isLogin ? "Log in to your account" : "Create your account"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mb-3">
                  <Lock className="h-5 w-5 text-gray-400 " />
                </span>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                {isLogin ? "Log in" : "Sign up"}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <button
                  // onClick={() => handleSocialSignIn("google")}
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                  />
                </button>
              </div>
              <div>
                <button
                  // onClick={() => handleSocialSignIn("linkedin")}
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/448234/linkedin.svg"
                    alt="LinkedIn logo"
                  />
                </button>
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
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={(e) => {
                e.preventDefault();
                isLogin ? router.push("/signin") : router.push("/signup");
              }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthComponent;
