// components/CorrectAnswerRow.tsx
import type { PlayerInfo } from "@/types/game";

interface CorrectAnswerRowProps {
  player: PlayerInfo;
}

export default function CorrectAnswerRow({ player }: CorrectAnswerRowProps) {
  return (
    <>
      {/* Mobile: Name on its own row */}
      <div className="md:hidden bg-sage-green border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm mb-2">
        <div className="text-white">✓ {player.name}</div>
      </div>

      {/* Grid row */}
      <div className="grid grid-cols-6 md:grid-cols-7 gap-2">
        {/* Desktop: Name in first column */}
        <div className="hidden md:block bg-sage-green border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm">
          <div className="text-white">{player.name}</div>
        </div>

        <div className="bg-sage-green text-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
          <div className="truncate">{player.team}</div>
        </div>
        <div className="bg-sage-green text-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
          <div className="truncate">{player.division}</div>
        </div>
        <div className="bg-sage-green text-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
          {player.position}
        </div>
        <div className="bg-sage-green text-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
          {player.sweater}
        </div>
        <div className="bg-sage-green text-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
          {player.age}
        </div>
        <div className="bg-sage-green text-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
          <div className="truncate">{player.country}</div>
        </div>
      </div>
    </>
  );
}