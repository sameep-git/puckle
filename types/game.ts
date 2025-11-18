import type { Player as FullPlayer } from "@/types/player";

// For game state we only need a minimal player shape (id + name).
export type Player = Pick<FullPlayer, "Id" | "Name">;

export interface GuessResult {
  isCorrect: boolean;
  player: {
    name: string;
    team: string;
    division: string;
    position: string;
    sweater: number;
    age: number;
    country: string;
  };
  matches: {
    team: boolean;
    division: boolean;
    divisionClose: boolean;
    position: boolean;
    positionClose: boolean;
    sweater: boolean;
    sweaterClose: boolean;
    age: boolean;
    ageClose: boolean;
    country: boolean;
    countryClose: boolean;
  };
  hints: {
    sweater: "exact" | "higher" | "lower";
    age: "exact" | "higher" | "lower";
  };
}

// PlayerInfo is the shape returned by the player API and used when showing the
// correct player details. It mirrors the data inside GuessResult.player plus
// optional headshot returned by the API.
export type PlayerInfo = {
  name: string;
  team: string;
  division: string;
  position: string;
  sweater: number;
  age: number;
  country: string;
  headshot?: string | null;
};