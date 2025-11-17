// components/GuessGrid.tsx
import type { GuessResult, PlayerInfo } from "@/types/game";
import GuessRow from "./GuessRow";
import CorrectAnswerRow from "./CorrectAnswerRow";

interface GuessGridProps {
  guesses: GuessResult[];
  triesLeft: number;
  gameLost: boolean;
  correctPlayer?: PlayerInfo | null;
}

export default function GuessGrid({ guesses, triesLeft, gameLost, correctPlayer }: GuessGridProps) {
  if (guesses.length === 0 && !gameLost) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="space-y-4">
        {/* Show correct answer first if game is lost */}
        {gameLost && correctPlayer && (
          <div className="space-y-4 pb-4 border-b-4 border-black mb-4">
            <div className="text-center">
              <p className="font-bold text-cornflower uppercase text-lg mb-3">Correct Answer:</p>
            </div>
            
            {/* Header for correct answer */}
            <div className="hidden md:grid grid-cols-7 gap-2 text-center font-bold text-sm">
              <div>NAME</div>
              <div>TEAM</div>
              <div>DIV</div>
              <div>POS</div>
              <div>#</div>
              <div>AGE</div>
              <div>COUNTRY</div>
            </div>

            <div className="grid md:hidden grid-cols-6 gap-2 text-center font-bold text-xs">
              <div>TEAM</div>
              <div>DIV</div>
              <div>POS</div>
              <div>#</div>
              <div>AGE</div>
              <div>CTY</div>
            </div>

            <CorrectAnswerRow player={correctPlayer} />
          </div>
        )}

        {/* Then show "Your Guesses" header and guess rows */}
        {guesses.length > 0 && (
          <>
            {gameLost && (
              <div className="text-center mb-3">
                <p className="font-bold text-taupe uppercase text-sm">Your Guesses:</p>
              </div>
            )}

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
          </>
        )}

        {!gameLost && (
          <div className="text-center mt-4">
            <p className="font-bold text-taupe">{triesLeft} TRIES LEFT</p>
          </div>
        )}
      </div>
    </div>
  );
}