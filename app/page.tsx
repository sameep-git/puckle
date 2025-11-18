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

const MAX_GUESSES = 6;

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
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

  // Load game state from cloud if logged in, localStorage if not
  useEffect(() => {
    const loadGame = async () => {
      if (authLoading) return; // Wait for auth to load

      const today = new Date().toISOString().slice(0, 10);
      setDateString(today);

      if (user) {
        // Logged in: load from database
        try {
          const res = await fetch("/api/user-stats");
          const stats = await res.json();

          // Check if there's a game in progress for today
          if (stats.current_game_date === today && stats.current_game_target_player_id) {
            setTargetPlayerId(stats.current_game_target_player_id);
            setGuesses(stats.current_game_guesses || []);
            setGameWon(stats.current_game_won);
            setGameLost(stats.current_game_guesses?.length >= MAX_GUESSES && !stats.current_game_won);
            
            // Fetch silhouette
            const dailyRes = await fetch("/api/daily-player");
            const dailyData = await dailyRes.json();
            setSilhouette(dailyData.silhouette);
            setIsFetchingSilhouette(false);
            return;
          }
        } catch (error) {
          console.error("Failed to load stats:", error);
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
      }

      // New game: fetch today's player
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
    };

    loadGame();
  }, [user, authLoading]);

  // Save to localStorage for anonymous users (keep this for backward compatibility)
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

      // Save to database if logged in
      if (user) {
        try {
          await fetch("/api/user-stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              current_game_date: dateString,
              current_game_target_player_id: targetPlayerId,
              current_game_guesses: newGuesses,
              current_game_won: won,
              current_game_completed: won || lost,
            }),
          });

          // If game completed, update streaks and distribution
          if (won || lost) {
            // Fetch current stats to calculate new streaks
            const statsRes = await fetch("/api/user-stats");
            const currentStats = await statsRes.json();

            // Calculate new streaks
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            let newStreak = 0;
            
            if (won) {
              if (currentStats.last_played_date === yesterday) {
                // Streak continues
                newStreak = (currentStats.current_streak || 0) + 1;
              } else {
                // New streak
                newStreak = 1;
              }
            }

            const newLongestStreak = Math.max(newStreak, currentStats.longest_streak || 0);

            // Update guess distribution if won
            const newDistribution = { ...(currentStats.guess_distribution || {}) };
            if (won) {
              const guessCount = newGuesses.length.toString();
              newDistribution[guessCount] = (newDistribution[guessCount] || 0) + 1;
            }

            // Update stats with streaks and distribution
            await fetch("/api/user-stats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                current_streak: newStreak,
                longest_streak: newLongestStreak,
                last_played_date: dateString,
                guess_distribution: newDistribution,
              }),
            });
          }
        } catch (error) {
          console.error("Failed to save to database:", error);
        }
      }
      // localStorage save happens automatically via useEffect above
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