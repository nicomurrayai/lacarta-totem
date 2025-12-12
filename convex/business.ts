import { query } from "./_generated/server";
import { v } from "convex/values";

// Query para obtener un negocio por slug con sus productos
export const getBusinessBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Buscar el negocio por slug
    const business = await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!business) {
      return null;
    }

    // Obtener todos los productos del negocio
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("businessId"), business._id))
      .collect();

    // Retornar el negocio con sus productos
    return {
      ...business,
      products,
    };
  },
});