// app/api/search-players/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  const supabase = supabaseServer();
  
  const { data: players, error } = await supabase
    .from("players")
    .select("Id, Name")
    .ilike("Name", `%${query}%`)
    .order("Name", { ascending: true })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  return NextResponse.json(players || []);
}