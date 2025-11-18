import { Celebration } from "@mui/icons-material";

interface GameStatusProps {
  gameWon: boolean;
  gameLost: boolean;
}

export default function GameStatus({ gameWon, gameLost }: GameStatusProps) {
  if (gameWon) {
    return (
      <div className="mb-2">
        <div className="flex items-center gap-2 bg-sage-green border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Celebration htmlColor="white" /> 
          <p className="font-bold text-white uppercase text-2xl">YOU WON!</p>
        </div>
      </div>
    );
  }

  if (gameLost) {
    return (
      <div className="mb-2">
        <div className="bg-grapefruit border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-white uppercase text-2xl">GAME OVER</p>
        </div>
      </div>
    );
  }

  return null;
}