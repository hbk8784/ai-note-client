import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiService } from "../lib/api";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Invalid verification link");
        setIsLoading(false);
        return;
      }

      try {
        const response = (await apiService.verifyEmail(token)) as {
          message: string;
        };
        setMessage(response.message);
        toast.success("Email verified successfully!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 10000);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Email verification failed";
        setMessage(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-emerald-500 text-center"
      >
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
            <h2 className="text-xl font-semibold text-emerald-400">
              Verifying your email...
            </h2>
            <p className="text-gray-300">
              Please wait while we verify your email address.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl mb-4">
              {message.includes("successfully") ? "✅" : "❌"}
            </div>
            <h2 className="text-xl font-semibold text-emerald-400">
              {message.includes("successfully")
                ? "Email Verified!"
                : "Verification Failed"}
            </h2>
            <p className="text-gray-300">{message}</p>
            {message.includes("successfully") && (
              <p className="text-sm text-gray-400">
                Redirecting to login page in a few seconds...
              </p>
            )}
            <div className="pt-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
