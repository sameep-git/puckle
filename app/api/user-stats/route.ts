// app/api/user-stats/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

// GET - Load user's stats and current game progress
export async function GET(request: Request) {
  const supabase = await supabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: stats, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 = not found
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If no stats exist, create default
  if (!stats) {
    const { data: newStats, error: insertError } = await supabase
      .from("user_stats")
      .insert({
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        guess_distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 },
        current_game_guesses: [],
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(newStats);
  }

  return NextResponse.json(stats);
}

// POST - Update user's game progress
export async function POST(request: Request) {
  const supabase = await supabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    current_game_date,
    current_game_target_player_id,
    current_game_guesses,
    current_game_won,
    current_game_completed,
    // If game is completed, also update streaks
    current_streak,
    longest_streak,
    last_played_date,
    guess_distribution,
  } = body;

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  // Update current game progress
  if (current_game_date !== undefined) updateData.current_game_date = current_game_date;
  if (current_game_target_player_id !== undefined) updateData.current_game_target_player_id = current_game_target_player_id;
  if (current_game_guesses !== undefined) updateData.current_game_guesses = current_game_guesses;
  if (current_game_won !== undefined) updateData.current_game_won = current_game_won;
  if (current_game_completed !== undefined) updateData.current_game_completed = current_game_completed;

  // Update stats if game completed
  if (current_streak !== undefined) updateData.current_streak = current_streak;
  if (longest_streak !== undefined) updateData.longest_streak = longest_streak;
  if (last_played_date !== undefined) updateData.last_played_date = last_played_date;
  if (guess_distribution !== undefined) updateData.guess_distribution = guess_distribution;

  const { data, error } = await supabase
    .from("user_stats")
    .update(updateData)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}