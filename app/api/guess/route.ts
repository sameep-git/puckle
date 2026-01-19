// app/api/guess/route.ts
import { NextResponse } from "next/server";
import { isSameConference, isSamePositionGroup, isNumberClose, isCountryClose } from "@/lib/nhlData";
import { calculateAge } from "@/lib/utils";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(request: Request) {
  const body = await request.json();
  const { guessedPlayerId, targetPlayerId } = body;

  if (!guessedPlayerId || !targetPlayerId) {
    return NextResponse.json(
      { error: "Missing player IDs" },
      { status: 400 }
    );
  }

  try {
    // Fetch both players
    const guessedPlayer = await convex.query(api.players.get, { id: guessedPlayerId as Id<"players"> });
    const targetPlayer = await convex.query(api.players.get, { id: targetPlayerId as Id<"players"> });

    if (!guessedPlayer || !targetPlayer) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    // Map Convex fields to logic (Convex uses lowercase keys usually, check schema)
    // Schema was defined in step 125, using LOWERCASE fields.
    // players: { name, team, division, position, sweater, birthDate, .. }
    // Logic below uses UPPERCASE (Supabase style). Need to map.

    const guessed = {
      Id: guessedPlayer._id,
      Name: guessedPlayer.name,
      Team: guessedPlayer.team,
      Division: guessedPlayer.division,
      Position: guessedPlayer.position,
      Sweater: guessedPlayer.sweater,
      BirthDate: guessedPlayer.birthDate,
      Country: guessedPlayer.country
    };

    const target = {
      Id: targetPlayer._id,
      Name: targetPlayer.name,
      Team: targetPlayer.team,
      Division: targetPlayer.division,
      Position: targetPlayer.position,
      Sweater: targetPlayer.sweater,
      BirthDate: targetPlayer.birthDate,
      Country: targetPlayer.country
    };

    const guessedAge = calculateAge(guessed.BirthDate);
    const targetAge = calculateAge(target.BirthDate);

    // Determine hint levels
    const teamMatch = guessed.Team === target.Team;
    const divisionMatch = guessed.Division === target.Division;
    const divisionClose = isSameConference(guessed.Division, target.Division);

    const positionMatch = guessed.Position === target.Position;
    const positionClose = isSamePositionGroup(guessed.Position, target.Position);

    const sweaterMatch = guessed.Sweater === target.Sweater;
    const sweaterClose = isNumberClose(guessed.Sweater, target.Sweater, 10);

    const ageMatch = guessedAge === targetAge;
    const ageClose = isNumberClose(guessedAge, targetAge, 2);

    const countryMatch = guessed.Country === target.Country;
    const countryClose = await isCountryClose(guessed.Country, target.Country);

    // Build comparison response
    const comparison = {
      isCorrect: guessed.Id === target.Id,
      player: {
        name: guessed.Name,
        team: guessed.Team,
        division: guessed.Division,
        position: guessed.Position,
        sweater: guessed.Sweater,
        age: guessedAge,
        country: guessed.Country,
      },
      matches: {
        team: teamMatch,
        division: divisionMatch,
        divisionClose: divisionClose && !divisionMatch, // Yellow hint
        position: positionMatch,
        positionClose: positionClose && !positionMatch, // Yellow hint
        sweater: sweaterMatch,
        sweaterClose: sweaterClose && !sweaterMatch, // Yellow hint
        age: ageMatch,
        ageClose: ageClose && !ageMatch, // Yellow hint
        country: countryMatch,
        countryClose: countryClose && !countryMatch, // Yellow hint
      },
      hints: {
        sweater:
          sweaterMatch
            ? "exact"
            : guessed.Sweater > target.Sweater
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

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }

}