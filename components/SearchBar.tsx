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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setHighlightedIndex(-1);

    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/search-players?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (_error) {
      console.error("Search failed:", error);
    }
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setSearchQuery(player.Name);
    setSearchResults([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === "Enter") {
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleSelectPlayer(searchResults[highlightedIndex]);
        } else if (selectedPlayer) {
          onGuessSubmit(selectedPlayer);
          setSearchQuery("");
          setSelectedPlayer(null);
        }
      }
    } else if (e.key === "Enter" && selectedPlayer) {
      onGuessSubmit(selectedPlayer);
      setSearchQuery("");
      setSelectedPlayer(null);
    }
  };

  // Trigger guess when Enter is pressed without focus on the input
  useEffect(() => {
    if (disabled) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      const activeElement = document.activeElement as HTMLElement | null;
      const isInputFocused = inputRef.current && activeElement === inputRef.current;
      const isBodyFocused = !activeElement || activeElement === document.body;

      if (isInputFocused || !isBodyFocused) return;

      if (selectedPlayer) {
        onGuessSubmit(selectedPlayer);
        setSearchQuery("");
        setSelectedPlayer(null);
        setSearchResults([]);
        setHighlightedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [disabled, selectedPlayer, onGuessSubmit]);

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
        className="w-full px-6 py-5 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white uppercase placeholder:text-taupe/50 disabled:opacity-50"
      />

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute w-full mt-4 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-20">
          {searchResults.map((player, index) => (
            <button
              key={index}
              onClick={() => handleSelectPlayer(player)}
              className={`w-full px-6 py-4 text-left font-bold border-b-4 border-black last:border-b-0 transition-colors uppercase ${index === highlightedIndex ? "bg-icy-blue" : "hover:bg-icy-blue"
                }`}
              tabIndex={-1}
            >
              {player.Name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}