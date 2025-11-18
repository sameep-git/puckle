// components/Auth/AuthModal.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Close } from "@mui/icons-material";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        alert("Check your email to confirm your account!");
      } else {
        await signIn(email, password);
      }
      onClose();
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-platinum border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-cornflower border-b-4 border-black p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white uppercase">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-grapefruit transition-colors"
          >
            <Close htmlColor="white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2 uppercase text-sm">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 uppercase text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-grapefruit border-4 border-black px-4 py-3">
                <p className="font-bold text-white text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-cornflower text-white border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold uppercase disabled:opacity-50"
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center font-bold text-sm text-taupe hover:text-cornflower transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}