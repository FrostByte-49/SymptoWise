/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useToast } from "../hooks/useToast"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/profile");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setError("Please verify your email first. We've sent a new verification link.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      showToast("Logged in successfully!", "success");
      navigate("/profile");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Account not found. Please register.");
      } else if (err.code === "auth/wrong-password") {
        setError("Invalid password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showToast(`Password reset link sent to ${email}`, "success");
    } catch (error: any) {
      setError("Failed to send reset email: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-primary-600 dark:text-primary-400 mb-2">
          Welcome Back
        </h2>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Log in to continue to{" "}
          <span className="font-semibold text-accent-600 dark:text-accent-400">SymptoWise</span>
        </p>
        
        {error && (
          <div className={`mb-4 p-4 rounded-lg ${
            error.includes("verify your email") 
              ? "bg-blue-50 border-l-4 border-blue-400 text-blue-700"
              : "bg-red-50 border-l-4 border-red-400 text-red-700"
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {error.includes("verify your email") ? (
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
                {error.includes("verify your email") && (
                  <button
                    onClick={() => auth.currentUser && sendEmailVerification(auth.currentUser)}
                    className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-600 underline"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-primary-600 hover:bg-primary-700 transition-colors text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-accent-600 dark:text-accent-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;