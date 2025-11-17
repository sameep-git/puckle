import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import 'dotenv/config';

async function main() {
  console.log("Seeding players...");

  // Load JSON file from get_data/
  const filePath = path.join(process.cwd(), "get_data", "players.json");
  if (!fs.existsSync(filePath)) {
    console.error("players.json not found in get_data/");
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, "utf-8");
  const players = JSON.parse(rawData);

  console.log(`Found ${players.length} players in players.json`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const batchSize = 500;

  for (let i = 0; i < players.length; i += batchSize) {
    const chunk = players.slice(i, i + batchSize);

    const { error } = await supabase
      .from("players")
      .upsert(chunk, { onConflict: "Id" });

    if (error) {
      console.error("Error inserting batch:", error);
      process.exit(1);
    } else {
      console.log(`Inserted ${i + chunk.length}/${players.length}`);
    }
  }

  console.log("Players seeding completed.");
}

main();
