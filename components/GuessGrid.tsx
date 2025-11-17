import type { GuessResult } from "@/types/game";
import GuessRow from "./GuessRow";

interface GuessGridProps {
  guesses: GuessResult[];
  triesLeft: number;
}

export default function GuessGrid({ guesses, triesLeft }: GuessGridProps) {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="space-y-4">
        {/* Header Row - adjusted for mobile */}
        <div className="hidden md:grid grid-cols-7 gap-2 text-center font-bold text-sm">
          <div>NAME</div>
          <div>TEAM</div>
          <div>DIV</div>
          <div>POS</div>
          <div>#</div>
          <div>AGE</div>
          <div>COUNTRY</div>
        </div>

        {/* Mobile header - 6 columns */}
        <div className="grid md:hidden grid-cols-6 gap-2 text-center font-bold text-xs">
          <div>TEAM</div>
          <div>DIV</div>
          <div>POS</div>
          <div>#</div>
          <div>AGE</div>
          <div>CTY</div>
        </div>

        {/* Guess Rows */}
        {guesses.map((guess, idx) => (
          <GuessRow key={idx} guess={guess} />
        ))}

        <div className="text-center mt-4">
          <p className="font-bold text-taupe">{triesLeft} TRIES LEFT</p>
        </div>
      </div>
    </div>
  );
}