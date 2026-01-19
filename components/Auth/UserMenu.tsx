"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import { Person } from "@mui/icons-material";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Use Convex query hook instead of fetch
  const stats = useQuery(api.stats.get);
  const loadingStats = stats === undefined && !!user;

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="fixed top-2 left-2 bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold uppercase text-sm z-30"
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

  // Calculate total wins
  const totalWins = stats && stats.guessDistribution
    ? Object.values(stats.guessDistribution as Record<string, number>).reduce((sum, count) => sum + count, 0)
    : 0;

  // Find max value for bar chart scaling
  const maxCount = stats && stats.guessDistribution
    ? Math.max(...Object.values(stats.guessDistribution as Record<string, number>), 1)
    : 1;

  return (
    <>
      <div className="fixed top-2 left-2 z-30">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 bg-cornflower text-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold uppercase text-sm"
        >
          <Person /> {user.email?.split("@")[0]}
        </button>

        {showMenu && (
          <div className="absolute top-16 left-0 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[320px] max-w-[400px]">
            {loadingStats ? (
              <div className="px-6 py-8 text-center">
                <p className="font-bold text-taupe animate-pulse">Loading stats...</p>
              </div>
            ) : stats ? (
              <>
                {/* Stats Display */}
                <div className="px-6 py-4 border-b-4 border-black">
                  <h3 className="font-bold text-lg uppercase mb-3 text-cornflower">
                    Your Stats
                  </h3>

                  {/* Streaks */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-platinum border-2 border-black p-3 text-center">
                      <div className="text-2xl font-bold text-cornflower">
                        {stats.currentStreak}
                      </div>
                      <div className="text-xs font-bold uppercase text-taupe">
                        Current Streak
                      </div>
                    </div>
                    <div className="bg-platinum border-2 border-black p-3 text-center">
                      <div className="text-2xl font-bold text-cornflower">
                        {stats.longestStreak}
                      </div>
                      <div className="text-xs font-bold uppercase text-taupe">
                        Best Streak
                      </div>
                    </div>
                  </div>

                  {/* Total Wins */}
                  <div className="bg-platinum border-2 border-black p-3 text-center mb-4">
                    <div className="text-2xl font-bold text-cornflower">
                      {totalWins}
                    </div>
                    <div className="text-xs font-bold uppercase text-taupe">
                      Total Wins
                    </div>
                  </div>

                  {/* Guess Distribution */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-taupe mb-2">
                      Guess Distribution
                    </h4>
                    <div className="space-y-1">
                      {[1, 2, 3, 4, 5, 6].map((num) => {
                        const count = (stats.guessDistribution as Record<string, number>)[num.toString()] || 0;
                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                        return (
                          <div key={num} className="flex items-center gap-2 text-sm">
                            <div className="font-bold w-3">{num}</div>
                            <div className="flex-1 bg-platinum border-2 border-black h-6 relative overflow-hidden">
                              <div
                                className="bg-cornflower h-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-end pr-2">
                                <span className="font-bold text-xs">
                                  {count}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-6 py-4 border-b-4 border-black">
                <p className="text-sm text-taupe text-center">
                  No stats yet. Play a game to start tracking!
                </p>
              </div>
            )}

            {/* Sign Out Button */}
            <button
              onClick={() => {
                signOut();
                setShowMenu(false);
                // setStats(null); // Managed by hook now
              }}
              className="w-full px-6 py-3 text-left font-bold hover:bg-grapefruit hover:text-white transition-colors uppercase text-sm"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
}