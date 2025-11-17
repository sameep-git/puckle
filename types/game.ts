export interface Player {
  Id: string;
  Name: string;
}

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
    country: boolean;
  };
  hints: {
    sweater: "exact" | "higher" | "lower";
    age: "exact" | "higher" | "lower";
  };
}