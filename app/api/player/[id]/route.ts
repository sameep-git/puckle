// app/api/player/[id]/route.ts
import { NextResponse } from "next/server";
import { calculateAge } from "@/lib/utils";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing player id" }, { status: 400 });
  }

  try {
    const player = await convex.query(api.players.get, { id: id as Id<"players"> });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const age = calculateAge(player.birthDate);

    return NextResponse.json({
      name: player.name,
      team: player.team,
      division: player.division,
      position: player.position,
      sweater: player.sweater,
      age: age,
      country: player.country,
      headshot: player.headshot,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid ID or Server Error" }, { status: 500 });
  }
}