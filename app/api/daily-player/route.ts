import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = supabaseServer();
  
  const { data: players, error } = await supabase
    .from("players")
    .select("Id")
    .order("Id", { ascending: true });
  
  if (error || !players || players.length === 0) {
    return NextResponse.json({ error: "Failed to load players" }, { status: 500 });
  }

  // Hash to get today's player
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % players.length;
  
  // Only return the ID and today's date
  return NextResponse.json({
    targetPlayerId: players[index].Id,
    date: today,
  });
}