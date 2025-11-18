// components/SilhouetteHint.tsx
"use client";
import { Close, Person } from "@mui/icons-material";
import { useState } from "react";

interface SilhouetteHintProps {
  silhouette: string | null;
  isLoading?: boolean;
}

export default function SilhouetteHint({ silhouette, isLoading = false }: SilhouetteHintProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Don't show anything while loading
  if (isLoading) {
    return (
      <div className="w-full max-w-xl mt-6">
        <div className="w-full bg-white border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold uppercase text-center text-taupe animate-pulse">
          Loading hint...
        </div>
      </div>
    );
  }

  if (!silhouette) return null;

  return (
    <div className="w-full max-w-xl mt-6">
      {!isRevealed ? (
        <button
          onClick={() => setIsRevealed(true)}
          className="flex items-center justify-center w-full bg-white border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold uppercase"
        >
            <Person />
            Show Silhouette Hint
        </button>
      ) : (
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
          {/* Close button */}
          <button
            onClick={() => setIsRevealed(false)}
            className="absolute top-2 right-2 bg-grapefruit border-2 border-black p-2 hover:bg-taupe transition-colors"
            aria-label="Close silhouette"
          >
            <Close htmlColor="white" />
          </button>

          <p className="font-bold text-center mb-4 uppercase text-sm text-taupe">
            Player Silhouette
          </p>
          <div className="flex justify-center">
            <img
              src={silhouette}
              alt="Player silhouette"
              className="max-w-[200px] max-h-[200px] border-4 border-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}