/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useToast } from "../hooks/useToast";
import { registerWithEmailAndPassword } from "../lib/firebase"; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the enhanced registration function that creates Firestore profile
      const user = await registerWithEmailAndPassword(name, email, password);
      
      await sendVerificationEmail(user);
      setVerificationSent(true);
      showToast("Verification email sent! Please check your inbox.", "success");
      
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Email already registered. Please log in.";
            break;
          case "auth/weak-password":
            errorMessage = "Password should be at least 6 characters.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (user: any) => {
    try {
      await sendEmailVerification(user);
      setVerificationSent(true);
    } catch (error: any) {
      const errorMessage = "Failed to send verification: " + error.message;
      setError(errorMessage);
      showToast(errorMessage, "error");
    }
  };

  const handleResendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendVerificationEmail(auth.currentUser);
        showToast("Verification email resent!", "success");
      }
    } catch (error: any) {
      const errorMessage = "Failed to resend verification: " + error.message;
      setError(errorMessage);
      showToast(errorMessage, "error");
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 20;
    if (password.length < 8) return 40;
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 60;
    return 100;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColor = passwordStrength < 40 ? "bg-red-500" : 
                       passwordStrength < 70 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        {verificationSent ? (
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-center text-primary-600 dark:text-primary-400 mb-2">
              Verify Your Email
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              We've sent a verification link to <span className="font-semibold">{email}</span>
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Can't find the email? Check your spam folder or
              </p>
              <button
                onClick={handleResendVerification}
                className="mt-2 text-sm text-accent-600 dark:text-accent-400 hover:underline font-medium"
              >
                Resend verification email
              </button>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
            >
              Proceed to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-center text-primary-600 dark:text-primary-400 mb-2">
              Create Account
            </h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              Join <span className="font-semibold text-accent-600 dark:text-accent-400">SymptoCare</span> to track your wellness journey!
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${strengthColor}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                      {passwordStrength < 40 ? "Weak" : 
                       passwordStrength < 70 ? "Moderate" : "Strong"} password
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to the <span className="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-primary-600 hover:bg-primary-700 transition-colors text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : "Register"}
              </button>
            </form>

            <div className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <span
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log in
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;