// lib/gameStorage.ts
import type { GuessResult } from "@/types/game";

interface GameState {
  date: string;
  targetPlayerId: string;
  guesses: GuessResult[];
  gameWon: boolean;
  gameLost: boolean;
}

const STORAGE_KEY = "puckle-game-state";

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const state: GameState = JSON.parse(saved);
    
    // Check if it's today's game
    const today = new Date().toISOString().slice(0, 10);
    if (state.date !== today) {
      // Old game, clear it
      clearGameState();
      return null;
    }
    
    return state;
  } catch (error) {
    console.error("Failed to load game state:", error);
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear game state:", error);
  }
}