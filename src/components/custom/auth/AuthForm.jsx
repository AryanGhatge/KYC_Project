import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export const AuthForm = ({
  isLogin,
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  isLoading,
}) => {
  const router = useRouter();

  const AnimatedPlaceholder = ({ text, isVisible }) => (
    <AnimatePresence>
      {isVisible && (
        <motion.span
          className="absolute left-10 top-3 transform -translate-y-1/2 text-orange-300 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );

  const handleSocialSignIn = (provider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    pressed: { scale: 0.95 },
  };

  return (
    <motion.div
      className="w-full md:w-1/2 p-12 bg-orange-50"
      variants={itemVariants}
    >
      <h2 className="text-3xl font-bold mb-6 text-orange-800">
        {isLogin ? "Access Your Account" : "Join the Network"}
      </h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className="block text-orange-800 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-orange-400" />
              </span>
              <input
                className="appearance-none border border-orange-300 rounded-lg w-full py-3 px-4 pl-10 bg-white text-orange-800 leading-tight focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <AnimatedPlaceholder text="John Doe" isVisible={!fullName} />
            </div>
          </motion.div>
        )}
        <motion.div className="mb-4" variants={itemVariants}>
          <label
            className="block text-orange-800 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-orange-400" />
            </span>
            <input
              className="appearance-none border border-orange-300 rounded-lg w-full py-3 px-4 pl-10 bg-white text-orange-800 leading-tight focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AnimatedPlaceholder text="you@example.com" isVisible={!email} />
          </div>
        </motion.div>
        <motion.div className="mb-6" variants={itemVariants}>
          <label
            className="block text-orange-800 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-orange-400" />
            </span>
            <input
              className="appearance-none border border-orange-300 rounded-lg w-full py-3 px-4 pl-10 bg-white text-orange-800 leading-tight focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <AnimatedPlaceholder text="••••••••" isVisible={!password} />
          </div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center transition duration-300 ease-in-out"
            type="submit"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="pressed"
          >
            {isLoading ? (
              <motion.div
                className="h-6 w-6 border-t-2 border-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ) : (
              <>
                {isLogin ? "Log in" : "Sign up"}
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
      <motion.div className="mt-8" variants={itemVariants}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-orange-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-orange-50 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {["google", "linkedin", "github"].map((provider) => (
            <motion.div
              key={provider}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => handleSocialSignIn(provider)}
                className="w-full flex items-center justify-center px-4 py-3 border border-orange-400 rounded-lg shadow-sm text-sm font-medium bg-white hover:bg-orange-400 transition duration-150 ease-in-out"
              >
                <img
                  className="h-5 w-5"
                  src={`https://www.svgrepo.com/show/${
                    provider === "google"
                      ? "475656/google-color"
                      : provider === "linkedin"
                      ? "448234/linkedin"
                      : "512317/github-142"
                  }.svg`}
                  alt={`${provider} logo`}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.p
        className="text-center mt-8 text-gray-500"
        variants={itemVariants}
      >
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <a
          href="#"
          className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-150 ease-in-out"
          onClick={(e) => {
            e.preventDefault();
            router.push(isLogin ? "/signin" : "/signup");
          }}
        >
          {isLogin ? "Sign up" : "Log in"}
        </a>
      </motion.p>
    </motion.div>
  );
};
