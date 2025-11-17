import { useState, useRef, useEffect } from "react";
import type { Player } from "@/types/game";

interface SearchBarProps {
  onGuessSubmit: (player: Player) => void;
  disabled: boolean;
}

export default function SearchBar({ onGuessSubmit, disabled }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on input
  useEffect(() => {
    const keepFocus = () => {
      if (inputRef.current && !disabled) {
        inputRef.current.focus();
      }
    };

    keepFocus();
    window.addEventListener("click", keepFocus);

    return () => window.removeEventListener("click", keepFocus);
  }, [disabled]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/search-players?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setSearchQuery(player.Name);
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedPlayer) {
      onGuessSubmit(selectedPlayer);
      setSearchQuery("");
      setSelectedPlayer(null);
    }
  };

  return (
    <div className="w-full max-w-xl relative">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="TYPE PLAYER NAME..."
        disabled={disabled}
        autoFocus
        className="w-full px-6 py-5 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white uppercase placeholder:text-taupe/50 disabled:opacity-50"
      />

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute w-full mt-4 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-20">
          {searchResults.map((player, index) => (
            <button
              key={index}
              onClick={() => handleSelectPlayer(player)}
              className="w-full px-6 py-4 text-left font-bold border-b-4 border-black last:border-b-0 hover:bg-icy-blue transition-colors uppercase"
            >
              {player.Name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}