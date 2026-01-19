
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Calculate daily player based on date hash
export const getDailyPlayer = action({
    args: {},
    handler: async (ctx): Promise<{
        targetPlayerId: Id<"players">;
        date: string;
        headshot: string | undefined;
    }> => {
        // 1. Get all players (or count) to pick an index
        const players = await ctx.runQuery(api.players.searchPlayers, { query: "" }); // Re-using search for "list all" for now

        if (!players || players.length === 0) {
            throw new Error("No players found");
        }

        const today = new Date().toISOString().slice(0, 10);
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = ((hash << 5) - hash) + today.charCodeAt(i);
            hash = hash & hash;
        }
        const index = Math.abs(hash) % players.length;
        const selectedPlayer = players[index];

        // Image processing (silhouette) requires Node.js `sharp` library.
        // We can't easily return the binary/base64 from here if we want to run this in standard Convex runtime (v8).
        // However, Convex Actions run in Node, so we CAN do it if `sharp` is installed.
        // BUT user has existing API route for this.
        // Strategy: Return the player ID and Headshot URL. Let the frontend/Next.js API handle the sharp processing if needed, 
        // OR migrate the sharp logic here.
        // Given the task, let's keep it simple: return the player details. 
        // The Next.js API `daily-player` can call this action, get the URL, then generate the silhouette.

        return {
            targetPlayerId: selectedPlayer._id,
            date: today,
            headshot: selectedPlayer.headshot
        };
    },
});
