// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import type { Player, GuessResult } from "@/types/game";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import GameStatus from "@/components/GameStatus";
import GuessGrid from "@/components/GuessGrid";
import InfoModal from "@/components/InfoModal";

const MAX_GUESSES = 6;

export default function HomePage() {
  const [targetPlayerId, setTargetPlayerId] = useState<string>("");
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const gameLost = guesses.length >= MAX_GUESSES && !gameWon;
  const gameActive = !gameWon && !gameLost;

  // Fetch daily player on mount
  useEffect(() => {
    const fetchDailyPlayer = async () => {
      try {
        const res = await fetch("/api/daily-player");
        const data = await res.json();
        setTargetPlayerId(data.targetPlayerId);
      } catch (error) {
        console.error("Failed to fetch daily player:", error);
      }
    };

    fetchDailyPlayer();
  }, []);

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

      setGuesses([...guesses, result]);

      if (result.isCorrect) {
        setGameWon(true);
      }
    } catch (error) {
      console.error("Guess submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col items-center pt-16 px-4">
      <InfoModal />
      
      <Logo />

      {gameActive && (
        <SearchBar onGuessSubmit={handleGuessSubmit} disabled={isLoading} />
      )}

      <GameStatus gameWon={gameWon} gameLost={gameLost} />

      <GuessGrid guesses={guesses} triesLeft={MAX_GUESSES - guesses.length} />
    </div>
  );
}