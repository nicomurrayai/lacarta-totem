import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const get = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    show: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, updates);
    
    return { success: true };
  },
});

export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    
    return { success: true };
  },
});