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

const MAX_GUESSES = 6;

export default function HomePage() {
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

  // Load saved game state on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDateString(today);

    // Try to load saved game first
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

    // No saved game, fetch today's player
    const fetchDailyPlayer = async () => {
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

    fetchDailyPlayer();
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (targetPlayerId && dateString) {
      saveGameState({
        date: dateString,
        targetPlayerId,
        guesses,
        gameWon,
        gameLost,
        silhouette,
      });
    }
  }, [targetPlayerId, guesses, gameWon, gameLost, dateString, silhouette]);

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
      setGuesses(newGuesses);

      if (result.isCorrect) {
        setGameWon(true);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameLost(true);
      }
    } catch (error) {
      console.error("Guess submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        gameLost={gameLost}
        correctPlayer={correctPlayer}
      />
    </div>
  );
}