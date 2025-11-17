import type { GuessResult } from "@/types/game";

interface GuessRowProps {
  guess: GuessResult;
}

export default function GuessRow({ guess }: GuessRowProps) {
  const getCellClass = (
    isExact: boolean,
    isClose: boolean = false,
    baseClass: string = ""
  ) => {
    let bgClass = "bg-taupe text-white";
    if (isExact) {
      bgClass = "bg-cornflower text-white";
    } else if (isClose) {
      bgClass = "bg-peach text-black";
    }
    return `border-4 border-black px-2 py-2 md:px-3 md:py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm ${bgClass} ${baseClass}`;
  };

  return (
    <>
      {/* Mobile: Name on its own row */}
      <div className="md:hidden bg-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm mb-2">
        {guess.player.name}
      </div>

      {/* Mobile: 6 columns without name */}
      <div className="grid grid-cols-6 md:grid-cols-7 gap-2">
        {/* Desktop: Name in first column */}
        <div className="hidden md:block bg-white border-4 border-black px-3 py-3 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm">
          {guess.player.name}
        </div>

        <div className={getCellClass(guess.matches.team)}>
          <div className="truncate">{guess.player.team}</div>
        </div>
        <div className={getCellClass(guess.matches.division, guess.matches.divisionClose)}>
          <div className="truncate">{guess.player.division}</div>
        </div>
        <div className={getCellClass(guess.matches.position, guess.matches.positionClose)}>
          {guess.player.position}
        </div>
        <div className={getCellClass(guess.matches.sweater, guess.matches.sweaterClose)}>
          {guess.player.sweater}{" "}
          {guess.hints.sweater !== "exact" && (guess.hints.sweater === "higher" ? "↑" : "↓")}
        </div>
        <div className={getCellClass(guess.matches.age)}>
          {guess.player.age}{" "}
          {guess.hints.age !== "exact" && (guess.hints.age === "higher" ? "↑" : "↓")}
        </div>
        <div className={getCellClass(guess.matches.country)}>
          <div className="truncate">{guess.player.country}</div>
        </div>
      </div>
    </>
  );
}