
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const stats = await ctx.db
            .query("user_stats")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .unique();

        if (!stats) {
            // Return default structure if not found, but don't create on read
            return {
                currentStreak: 0,
                longestStreak: 0,
                guessDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 },
                currentGameGuesses: [],
                currentGameDate: undefined,
                currentGameTargetPlayerId: undefined,
                currentGameWon: undefined,
                currentGameCompleted: undefined,
                lastPlayedDate: undefined,
            };
        }
        return stats;
    },
});

export const update = mutation({
    args: {
        currentStreak: v.optional(v.number()),
        longestStreak: v.optional(v.number()),
        guessDistribution: v.optional(v.any()),
        currentGameGuesses: v.optional(v.array(v.any())),
        currentGameDate: v.optional(v.string()),
        currentGameTargetPlayerId: v.optional(v.string()),
        currentGameWon: v.optional(v.boolean()),
        currentGameCompleted: v.optional(v.boolean()),
        lastPlayedDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const stats = await ctx.db
            .query("user_stats")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .unique();

        if (stats) {
            await ctx.db.patch(stats._id, args);
            return await ctx.db.get(stats._id);
        } else {
            // Create new
            const newId = await ctx.db.insert("user_stats", {
                userId,
                currentStreak: args.currentStreak ?? 0,
                longestStreak: args.longestStreak ?? 0,
                guessDistribution: args.guessDistribution ?? { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 },
                currentGameGuesses: args.currentGameGuesses ?? [],
                ...args
            });
            return await ctx.db.get(newId);
        }
    },
});
