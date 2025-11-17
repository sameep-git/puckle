// components/Auth/UserMenu.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="fixed top-6 left-6 bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold uppercase text-sm"
        >
          Sign In
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <div className="fixed top-6 left-6 z-30">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-cornflower text-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold uppercase text-sm"
      >
        👤 {user.email?.split('@')[0]}
      </button>

      {showMenu && (
        <div className="absolute top-16 left-0 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[200px]">
          <button
            onClick={() => {
              signOut();
              setShowMenu(false);
            }}
            className="w-full px-6 py-3 text-left font-bold hover:bg-grapefruit hover:text-white transition-colors uppercase text-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}