// app/api/search-players/route.ts
import { NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const players = await convex.query(api.players.search, { query });

    // Map back to expected structure (capitalized?) No, previous return was Supabase casing.
    // Supabase `select("Id, Name")` returned { Id, Name }.
    // Convex returns { _id, name }.
    // We should map it to match frontend expectations if we don't change frontend yet.
    // Frontend expects `Id` and `Name`.

    const mapped = players.map(p => ({
      Id: p._id,
      Name: p.name
    }));

    return NextResponse.json(mapped);
  } catch (_error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}