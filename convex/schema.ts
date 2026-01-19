import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  players: defineTable({
    name: v.string(),
    team: v.string(),
    division: v.string(),
    position: v.string(),
    sweater: v.number(),
    birthDate: v.string(),
    country: v.string(),
    headshot: v.optional(v.string()), // Optional as not all players might have it initially or it might be null
  }).index("by_name", ["name"]),

  user_stats: defineTable({
    userId: v.id("users"), // Links to auth users
    currentStreak: v.number(),
    longestStreak: v.number(),
    guessDistribution: v.any(), // JSON object
    currentGameGuesses: v.array(v.any()), // Array of guess objects
    currentGameDate: v.optional(v.string()),
    currentGameTargetPlayerId: v.optional(v.string()), // ID string (might be convex ID later)
    currentGameWon: v.optional(v.boolean()),
    currentGameCompleted: v.optional(v.boolean()),
    lastPlayedDate: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
});
