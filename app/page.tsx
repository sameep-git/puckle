// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import type { Player, GuessResult, PlayerInfo } from "@/types/game";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import GameStatus from "@/components/GameStatus";
import GuessGrid from "@/components/GuessGrid";
import InfoModal from "@/components/InfoModal";
import AboutModal from "@/components/AboutModal";
import SilhouetteHint from "@/components/SilhouetteHint";
import { saveGameState, loadGameState } from "@/lib/gameStorage";
import UserMenu from "@/components/Auth/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const MAX_GUESSES = 6;

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  // Convex hooks
  const userStats = useQuery(api.stats.get);
  const updateUserStats = useMutation(api.stats.update);

  const [targetPlayerId, setTargetPlayerId] = useState<string>("");
  const [silhouette, setSilhouette] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [isFetchingSilhouette, setIsFetchingSilhouette] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [dateString, setDateString] = useState("");
  const [correctPlayer, setCorrectPlayer] = useState<PlayerInfo | null>(null);

  const gameActive = !gameWon && !gameLost;

  // Sync state from Convex if logged in, or localStorage if not
  useEffect(() => {
    const loadGame = async () => {
      if (authLoading) return;

      const today = new Date().toISOString().slice(0, 10);
      setDateString(today);

      if (user) {
        // Logged in: sync from userStats
        if (userStats) {
          // Check if there's a game in progress for today
          if (userStats.currentGameDate === today && userStats.currentGameTargetPlayerId) {
            setTargetPlayerId(userStats.currentGameTargetPlayerId);
            // Cast any to GuessResult[] if schema is loose, or ensure schema matches
            setGuesses((userStats.currentGameGuesses as GuessResult[]) || []);
            setGameWon(userStats.currentGameWon || false);
            setGameLost(!!(userStats.currentGameCompleted && !userStats.currentGameWon)); // specific logic?
            // Actually if completed and not won, it's lost.
            // Or if logic says guesses >= MAX and not won.
            // Let's trust local calculation for gameLost if not explicitly stored?
            // Convex schema has `currentGameWon` and `currentGameCompleted`.
            // If completed and won is false, it's lost.
            if (userStats.currentGameCompleted && !userStats.currentGameWon) {
              setGameLost(true);
            }

            // Fetch silhouette if not loaded
            if (!silhouette) {
              try {
                const dailyRes = await fetch("/api/daily-player");
                const dailyData = await dailyRes.json();
                setSilhouette(dailyData.silhouette);
              } catch (err) {
                console.error(err);
              } finally {
                setIsFetchingSilhouette(false);
              }
            } else {
              setIsFetchingSilhouette(false);
            }
            return;
          } else {
            // New game or stats specific to yesterday
            // Fetch today's player
            try {
              setIsFetchingSilhouette(true);
              const res = await fetch("/api/daily-player");
              const data = await res.json();
              setTargetPlayerId(data.targetPlayerId);
              setDateString(data.date);
              setSilhouette(data.silhouette);

              // Reset local state for new game
              setGuesses([]);
              setGameWon(false);
              setGameLost(false);
            } catch (error) {
              console.error("Failed to fetch daily player:", error);
            } finally {
              setIsFetchingSilhouette(false);
            }
          }
        }
      } else {
        // Not logged in: use localStorage
        const savedState = loadGameState();
        if (savedState) {
          setTargetPlayerId(savedState.targetPlayerId);
          setGuesses(savedState.guesses);
          setGameWon(savedState.gameWon);
          setGameLost(savedState.gameLost);
          setSilhouette(savedState.silhouette || null);
          setIsFetchingSilhouette(false);
          return;
        }

        // No saved state, fetch daily
        try {
          setIsFetchingSilhouette(true);
          const res = await fetch("/api/daily-player");
          const data = await res.json();
          setTargetPlayerId(data.targetPlayerId);
          setDateString(data.date);
          setSilhouette(data.silhouette);
        } catch (error) {
          console.error("Failed to fetch daily player:", error);
        } finally {
          setIsFetchingSilhouette(false);
        }
      }
    };

    loadGame();
  }, [user, authLoading, userStats]); // Depend on userStats to re-sync when loaded

  // Save to localStorage for anonymous users
  useEffect(() => {
    if (!user && targetPlayerId && dateString) {
      saveGameState({
        date: dateString,
        targetPlayerId,
        guesses,
        gameWon,
        gameLost,
        silhouette,
      });
    }
  }, [user, targetPlayerId, guesses, gameWon, gameLost, dateString, silhouette]);

  const handleGuessSubmit = async (player: Player) => {
    if (!targetPlayerId || isLoading) return;

    setIsLoading(true);

    try {
      // Validate guess (Client-side validation relying on API for comparison logic)
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guessedPlayerId: player.Id,
          targetPlayerId: targetPlayerId,
        }),
      });

      const result: GuessResult = await res.json();
      const newGuesses = [...guesses, result];
      const won = result.isCorrect;
      const lost = newGuesses.length >= MAX_GUESSES && !won;

      setGuesses(newGuesses);
      setGameWon(won);
      setGameLost(lost);

      // Save to Convex if logged in
      if (user) {
        try {
          // Logic for streaks is handled in Convex mutation usually?
          // Or computed here.
          // Supabase implementation computed it on client.
          // Ideally we move this logic to the backend mutation!
          // `convex/stats.ts` `update` mutation takes update args.

          // Let's look at what fields I send.
          // I can send `currentGameGuesses`, `currentGameWon`, etc.
          // If I want to update streaks, I should probably do it in the mutation logic in Convex
          // rather than passing it from client?
          // However, my `update` mutation (step 114) might just be a dumb setter (patch).

          // If I use the dumb setter, I need to compute stats here.
          // AND I need current stats. `userStats` has them.

          const updateData: Record<string, unknown> = {
            currentGameDate: dateString,
            currentGameTargetPlayerId: targetPlayerId,
            currentGameGuesses: newGuesses,
            currentGameWon: won,
            currentGameCompleted: won || lost,
            lastPlayedDate: userStats?.lastPlayedDate, // default to current
          };

          if (won || lost) {
            const currentStreak = userStats?.currentStreak || 0;
            const longestStreak = userStats?.longestStreak || 0;
            const guessDist = userStats?.guessDistribution as Record<string, number> ||
              { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };

            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            let newStreak = 0;

            if (won) {
              if (userStats?.lastPlayedDate === yesterday) {
                newStreak = currentStreak + 1;
              } else {
                // Check if played today already?
                if (userStats?.lastPlayedDate === dateString) {
                  newStreak = currentStreak; // Already updated?
                } else {
                  newStreak = 1;
                }
              }
            } else {
              newStreak = 0;
            }

            const newLongestStreak = Math.max(newStreak, longestStreak);
            const newDistribution = { ...guessDist };
            if (won) {
              const guessCount = newGuesses.length.toString();
              newDistribution[guessCount] = (newDistribution[guessCount] || 0) + 1;
            }

            updateData.currentStreak = newStreak;
            updateData.longestStreak = newLongestStreak;
            updateData.lastPlayedDate = dateString;
            updateData.guessDistribution = newDistribution;
          }

          await updateUserStats(updateData);

        } catch (err) {
          console.error("Failed to save to Convex:", err);
        }
      }
    } catch (error) {
      console.error("Guess submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch correct player when game is lost
  useEffect(() => {
    if (gameLost && targetPlayerId && !correctPlayer) {
      const fetchCorrectPlayer = async () => {
        try {
          const res = await fetch(`/api/player/${targetPlayerId}`);
          const data = await res.json();
          setCorrectPlayer(data);
        } catch (error) {
          console.error("Failed to fetch correct player:", error);
        }
      };

      fetchCorrectPlayer();
    }
  }, [gameLost, targetPlayerId, correctPlayer]);

  return (
    <div className="min-h-screen bg-platinum flex flex-col items-center pt-16 px-4 pb-20">
      <UserMenu />
      <InfoModal />
      <AboutModal />

      <Logo />

      {gameActive && (
        <>
          <SearchBar onGuessSubmit={handleGuessSubmit} disabled={isLoading} />
          <SilhouetteHint
            silhouette={silhouette}
            isLoading={isFetchingSilhouette}
          />
        </>
      )}

      <GameStatus gameWon={gameWon} gameLost={gameLost} />

      <GuessGrid
        guesses={guesses}
        triesLeft={MAX_GUESSES - guesses.length}
        gameWon={gameWon}
        gameLost={gameLost}
        correctPlayer={correctPlayer}
      />
    </div>
  );
}