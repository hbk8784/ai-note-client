import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import { apiService } from "../lib/api";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-emerald-500 text-center"
        >
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">
            Check Your Email
          </h2>
          <p className="text-gray-300 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Click the link in the email to reset your password. The link will
            expire in 1 hour.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Try Different Email
            </button>
            <Link
              to="/login"
              className="block w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition text-center"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/login"
        className="absolute z-50 left-6 top-6 text-emerald-400 outline-1 py-1 px-2 rounded-sm cursor-pointer hover:bg-emerald-400 hover:text-white hover:outline-0"
      >
        Back to Login
      </Link>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4 relative">
        <motion.main
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-emerald-500 z-10"
        >
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center mb-8 text-emerald-400"
          >
            Forgot Password?
          </motion.header>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-300 mb-8"
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiMail className="text-emerald-400" size={18} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <footer className="mt-6 text-center">
            <p className="text-gray-300">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </footer>
        </motion.main>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
