// app/api/player/[id]/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { calculateAge } from "@/lib/utils";

export async function GET(request: Request, context: any) {
  const supabase = supabaseServer();

  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing player id" }, { status: 400 });
  }

  const { data: player, error } = await supabase
    .from("players")
    .select("*")
    .eq("Id", id)
    .single();

  if (error || !player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const age = calculateAge(player.BirthDate);

  return NextResponse.json({
    name: player.Name,
    team: player.Team,
    division: player.Division,
    position: player.Position,
    sweater: player.Sweater,
    age: age,
    country: player.Country,
    headshot: player.Headshot,
  });
}