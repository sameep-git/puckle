"use client";
import { Close, Help } from "@mui/icons-material";
import { useState } from "react";

export default function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Info Button - moved back to top right */}
      <button
        onClick={() => setIsOpen(true)}
  className="fixed top-2 right-3 md:top-2 md:right-3 bg-white border-4 border-black py-1.5 px-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all z-30"
        aria-label="Help"
      >
        <Help />
      </button>

      {/* Modal - same as before */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-platinum border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-cornflower border-b-4 border-black p-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white uppercase">How to Play</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-grapefruit transition-colors"
              >
                <Close htmlColor="white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-lg font-bold">
                Guess the NHL player in 6 tries. After each guess, the color of the tiles will
                show how close your guess was.
              </p>

              {/* Color Legend */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sage-green border-4 border-black"></div>
                  <span className="font-bold">Correct! Exact match</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-peach border-4 border-black"></div>
                  <span className="font-bold">Close! Partial match</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-taupe border-4 border-black"></div>
                  <span className="font-bold">Wrong</span>
                </div>
              </div>

              {/* Column Rules */}
              <div className="space-y-4 border-t-4 border-black pt-6">
                <h3 className="text-xl font-bold uppercase text-cornflower">Column Rules</h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-lg">TEAM</h4>
                    <p>
                      <span className="text-sage-green">●</span> Green = Correct team
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">DIVISION</h4>
                    <p>
                      <span className="text-sage-green">●</span> Green = Correct division
                    </p>
                    <p>
                      <span className="text-peach">●</span> Yellow = Same conference, different
                      division
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">POSITION</h4>
                    <p>
                      <span className="text-sage-green">●</span> Green = Correct position
                    </p>
                    <p>
                      <span className="text-peach">●</span> Yellow = Same position group (Forward/Defense/Goalie)
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">NUMBER (#)</h4>
                    <p>
                      <span className="text-sage-green">●</span> Green = Correct number
                    </p>
                    <p>
                      <span className="text-peach">●</span> Yellow = Within ±10 of the actual number
                    </p>
                    <p>↑ = Target number is higher | ↓ = Target number is lower</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">AGE</h4>
                    <p>
                      <span className="text-sage-green">●</span> Green = Correct age
                    </p>
                    <p>
                      <span className="text-peach">●</span> Yellow = Within ±2 years of the actual age
                    </p>
                    <p>↑ = Target age is higher | ↓ = Target age is lower</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">COUNTRY</h4>
                    <p>
                      <span className="text-sage-green">●</span> Green = Correct country
                    </p>
                    <p>
                      <span className="text-peach">●</span> Yellow = Bordering country
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}