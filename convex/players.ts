
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: { id: v.id("players") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (args.query.length < 3) return [];

        // Fetch all players and filter in memory for case-insensitive partial matching
        // Fine for < 1000 players dataset
        const players = await ctx.db.query("players").collect();
        const lowerQuery = args.query.toLowerCase();
        return players.filter(p => p.name.toLowerCase().includes(lowerQuery)).slice(0, 10);
    },
});

// Using a separate search function for better implementation
export const searchPlayers = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        // Fetch all and filter in memory? Not efficient but fine for <1000 players.
        // Or just use the `by_name` index for prefix if capitalized correctly.
        // Let's fetch reasonably sized chunks or use appropriate Convex Search.
        // For MVP: Fetch all names (stats ok?) NO. 
        // Let's rely on defining a Search Index in the next step or just this logic:
        const players = await ctx.db.query("players").collect();
        const lowerQuery = args.query.toLowerCase();
        return players.filter(p => p.name.toLowerCase().includes(lowerQuery)).slice(0, 10);
    }
});


export const seed = mutation({
    args: {
        players: v.array(v.object({
            Name: v.string(),
            Team: v.string(),
            Division: v.string(),
            Position: v.string(),
            Sweater: v.number(),
            BirthDate: v.string(),
            Country: v.string(),
            Headshot: v.string(),
        }))
    },
    handler: async (ctx, args) => {
        for (const player of args.players) {
            // Check if exists to avoid dupes?
            // For simple seed, just insert.
            await ctx.db.insert("players", {
                name: player.Name,
                team: player.Team,
                division: player.Division,
                position: player.Position,
                sweater: player.Sweater,
                birthDate: player.BirthDate,
                country: player.Country,
                headshot: player.Headshot,
            });
        }
    },
});
