"use client";
import { useState } from "react";

export default function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Info Button - moved down and made responsive */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-60 md:bottom-6 md:right-60 bg-white border-4 border-black py-1.5 px-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all z-30"
        aria-label="Info"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="currentColor"
        >
          <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
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
                className="text-white hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="32"
                  viewBox="0 -960 960 960"
                  width="32"
                  fill="currentColor"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
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
                      <span className="text-peach">●</span> Yellow = Within ±2 years of the actual age
                    </p>
                    <p>↑ = Target age is higher | ↓ = Target age is lower</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">COUNTRY</h4>
                    <p>
                      <span className="text-sage-green">●</span> Green = Correct country
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