
import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function seed() {
    const playersStart = JSON.parse(fs.readFileSync("get_data/players.json", "utf8"));

    // Chunking to avoid payload limits if necessary (Convex limit is large but good practice)
    const chunkSize = 100;
    for (let i = 0; i < playersStart.length; i += chunkSize) {
        const chunk = playersStart.slice(i, i + chunkSize);
        console.log(`Seeding batch ${i} to ${i + chunkSize}...`);
        await client.mutation(api.players.seed, { players: chunk });
    }

    console.log("Seeding complete!");
}

seed().catch(console.error);
