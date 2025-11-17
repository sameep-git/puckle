// app/api/guess/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { isSameConference, isSamePositionGroup, isNumberClose } from "@/lib/nhlData";
import { calculateAge } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  const { guessedPlayerId, targetPlayerId } = body;

  if (!guessedPlayerId || !targetPlayerId) {
    return NextResponse.json(
      { error: "Missing player IDs" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();

  // Fetch both players
  const { data: guessedPlayer, error: guessError } = await supabase
    .from("players")
    .select("*")
    .eq("Id", guessedPlayerId)
    .single();

  const { data: targetPlayer, error: targetError } = await supabase
    .from("players")
    .select("*")
    .eq("Id", targetPlayerId)
    .single();

  if (guessError || targetError || !guessedPlayer || !targetPlayer) {
    return NextResponse.json(
      { error: "Player not found" },
      { status: 404 }
    );
  }

  const guessedAge = calculateAge(guessedPlayer.BirthDate);
  const targetAge = calculateAge(targetPlayer.BirthDate);

  // Determine hint levels
  const teamMatch = guessedPlayer.Team === targetPlayer.Team;
  const divisionMatch = guessedPlayer.Division === targetPlayer.Division;
  const divisionClose = isSameConference(guessedPlayer.Division, targetPlayer.Division);
  
  const positionMatch = guessedPlayer.Position === targetPlayer.Position;
  const positionClose = isSamePositionGroup(guessedPlayer.Position, targetPlayer.Position);
  
  const sweaterMatch = guessedPlayer.Sweater === targetPlayer.Sweater;
  const sweaterClose = isNumberClose(guessedPlayer.Sweater, targetPlayer.Sweater);

  // Build comparison response
  const comparison = {
    isCorrect: guessedPlayer.Id === targetPlayer.Id,
    player: {
      name: guessedPlayer.Name,
      team: guessedPlayer.Team,
      division: guessedPlayer.Division,
      position: guessedPlayer.Position,
      sweater: guessedPlayer.Sweater,
      age: guessedAge,
      country: guessedPlayer.Country,
    },
    matches: {
      team: teamMatch,
      division: divisionMatch,
      divisionClose: divisionClose && !divisionMatch, // Yellow hint
      position: positionMatch,
      positionClose: positionClose && !positionMatch, // Yellow hint
      sweater: sweaterMatch,
      sweaterClose: sweaterClose && !sweaterMatch, // Yellow hint
      age: guessedAge === targetAge,
      country: guessedPlayer.Country === targetPlayer.Country,
    },
    hints: {
      sweater:
        sweaterMatch
          ? "exact"
          : guessedPlayer.Sweater > targetPlayer.Sweater
          ? "lower"
          : "higher",
      age:
        guessedAge === targetAge
          ? "exact"
          : guessedAge > targetAge
          ? "lower"
          : "higher",
    },
  };

  return NextResponse.json(comparison);
}